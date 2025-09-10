/**
 * 📝 USER FORM PAGE - T7 Implementation
 * Página de formulário para criar/editar usuários
 * Demonstra o padrão FORM usando useUsers hook
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUsers } from '../src/hooks';
import type { CreateUserRequest, UpdateUserRequest } from '../src/lib/api/adapters';

interface UserFormState {
  mode: 'create' | 'edit';
  step: 1 | 2 | 3;
  formData: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'user' | 'admin' | 'moderator' | 'vip';
    metadata: {
      department?: string;
      position?: string;
      notes?: string;
    };
  };
  validationErrors: { [key: string]: string };
}

export default function UserForm() {
  const router = useRouter();
  const { id, mode } = router.query;
  
  const {
    currentUser,
    userLoading,
    getUserById,
    createUser,
    createLoading,
    createError,
    updateUser,
    updateLoading,
    updateError,
    validateCreateUser,
    validateUpdateUser
  } = useUsers();

  const [state, setState] = useState<UserFormState>({
    mode: (mode as 'create' | 'edit') || 'create',
    step: 1,
    formData: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'user',
      metadata: {}
    },
    validationErrors: {}
  });

  // ===============================================
  // 🔄 INITIALIZATION
  // ===============================================

  useEffect(() => {
    if (state.mode === 'edit' && id && typeof id === 'string') {
      getUserById(id);
    }
  }, [state.mode, id, getUserById]);

  useEffect(() => {
    if (state.mode === 'edit' && currentUser) {
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          email: currentUser.email || '',
          username: currentUser.username || '',
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          phoneNumber: currentUser.phoneNumber || '',
          role: currentUser.role as any,
          password: '', // Don't populate password for edit
          confirmPassword: ''
        }
      }));
    }
  }, [state.mode, currentUser]);

  // ===============================================
  // 🔧 FORM HANDLERS
  // ===============================================

  const handleInputChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      },
      validationErrors: {
        ...prev.validationErrors,
        [field]: '' // Clear error when user types
      }
    }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        metadata: {
          ...prev.formData.metadata,
          [field]: value
        }
      }
    }));
  };

  const handleStepChange = (step: 1 | 2 | 3) => {
    setState(prev => ({ ...prev, step }));
  };

  // ===============================================
  // ✅ VALIDATION
  // ===============================================

  const validateCurrentStep = (): boolean => {
    const errors: { [key: string]: string } = {};
    const { formData } = state;

    if (state.step === 1) {
      // Basic Info Validation
      if (!formData.email) {
        errors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email inválido';
      }

      if (!formData.username) {
        errors.username = 'Username é obrigatório';
      } else if (formData.username.length < 3) {
        errors.username = 'Username deve ter pelo menos 3 caracteres';
      }

      if (state.mode === 'create') {
        if (!formData.password) {
          errors.password = 'Password é obrigatório';
        } else if (formData.password.length < 6) {
          errors.password = 'Password deve ter pelo menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords não coincidem';
        }
      }
    }

    if (state.step === 2) {
      // Personal Info Validation
      if (!formData.firstName) {
        errors.firstName = 'Nome é obrigatório';
      }

      if (!formData.lastName) {
        errors.lastName = 'Sobrenome é obrigatório';
      }

      if (formData.phoneNumber && !/^\+?55\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Formato de telefone inválido';
      }
    }

    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const validateForm = (): boolean => {
    if (state.mode === 'create') {
      const validation = validateCreateUser({
        email: state.formData.email,
        username: state.formData.username,
        password: state.formData.password,
        firstName: state.formData.firstName,
        lastName: state.formData.lastName,
        phoneNumber: state.formData.phoneNumber,
        role: state.formData.role,
        metadata: state.formData.metadata
      });
      
      if (!validation.valid) {
        const errors: { [key: string]: string } = {};
        validation.errors.forEach(error => {
          const [field] = error.split(' ');
          errors[field.toLowerCase()] = error;
        });
        setState(prev => ({ ...prev, validationErrors: errors }));
        return false;
      }
    } else {
      const validation = validateUpdateUser({
        email: state.formData.email,
        username: state.formData.username,
        firstName: state.formData.firstName,
        lastName: state.formData.lastName,
        phoneNumber: state.formData.phoneNumber,
        role: state.formData.role,
        metadata: state.formData.metadata
      });
      
      if (!validation.valid) {
        const errors: { [key: string]: string } = {};
        validation.errors.forEach(error => {
          const [field] = error.split(' ');
          errors[field.toLowerCase()] = error;
        });
        setState(prev => ({ ...prev, validationErrors: errors }));
        return false;
      }
    }

    return true;
  };

  // ===============================================
  // 💾 FORM SUBMISSION
  // ===============================================

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (state.mode === 'create') {
        const userData: CreateUserRequest = {
          email: state.formData.email,
          username: state.formData.username,
          password: state.formData.password,
          firstName: state.formData.firstName,
          lastName: state.formData.lastName,
          phoneNumber: state.formData.phoneNumber,
          role: state.formData.role,
          metadata: state.formData.metadata
        };

        const result = await createUser(userData);
        if (result) {
          router.push(`/users-details?id=${result.id}`);
        }
      } else if (currentUser) {
        const userData: UpdateUserRequest = {
          email: state.formData.email,
          username: state.formData.username,
          firstName: state.formData.firstName,
          lastName: state.formData.lastName,
          phoneNumber: state.formData.phoneNumber,
          role: state.formData.role,
          metadata: state.formData.metadata
        };

        const result = await updateUser(currentUser.id, userData);
        if (result) {
          router.push(`/users-details?id=${result.id}`);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              state.step >= stepNumber
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                state.step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderFormField = (
    field: string,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: { value: string; label: string }[]
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select
          value={state.formData[field as keyof typeof state.formData] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.validationErrors[field] ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={state.formData[field as keyof typeof state.formData] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.validationErrors[field] ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={`Digite ${label.toLowerCase()}`}
        />
      )}
      {state.validationErrors[field] && (
        <p className="mt-1 text-sm text-red-600">{state.validationErrors[field]}</p>
      )}
    </div>
  );

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  if (state.mode === 'edit' && userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/users-list')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Voltar para lista
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📝 {state.mode === 'create' ? 'Criar Usuário' : 'Editar Usuário'}
          </h1>
          <p className="text-gray-600">
            {state.mode === 'create'
              ? 'Preencha os dados para criar um novo usuário'
              : 'Atualize as informações do usuário'}
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Step 1: Basic Information */}
            {state.step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📧 Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFormField('email', 'Email', 'email', true)}
                  {renderFormField('username', 'Username', 'text', true)}
                </div>
                
                {state.mode === 'create' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderFormField('password', 'Password', 'password', true)}
                    {renderFormField('confirmPassword', 'Confirmar Password', 'password', true)}
                  </div>
                )}
                
                <div>
                  {renderFormField('role', 'Role', 'select', true, [
                    { value: 'user', label: 'Usuário' },
                    { value: 'vip', label: 'VIP' },
                    { value: 'moderator', label: 'Moderador' },
                    { value: 'admin', label: 'Administrador' }
                  ])}
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {state.step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  👤 Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFormField('firstName', 'Nome', 'text', true)}
                  {renderFormField('lastName', 'Sobrenome', 'text', true)}
                </div>
                
                <div>
                  {renderFormField('phoneNumber', 'Telefone', 'tel', false)}
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {state.step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Informações Adicionais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={state.formData.metadata.department || ''}
                      onChange={(e) => handleMetadataChange('department', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Tecnologia, Vendas, Marketing"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={state.formData.metadata.position || ''}
                      onChange={(e) => handleMetadataChange('position', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Desenvolvedor, Gerente, Analista"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={state.formData.metadata.notes || ''}
                    onChange={(e) => handleMetadataChange('notes', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Informações adicionais sobre o usuário..."
                  />
                </div>
                
                {/* Form Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📋 Resumo</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Email:</strong> {state.formData.email}</p>
                    <p><strong>Nome:</strong> {state.formData.firstName} {state.formData.lastName}</p>
                    <p><strong>Role:</strong> {state.formData.role}</p>
                    {state.formData.phoneNumber && (
                      <p><strong>Telefone:</strong> {state.formData.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {(createError || updateError) && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">
                  {createError || updateError}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <div>
              {state.step > 1 && (
                <button
                  onClick={() => handleStepChange((state.step - 1) as 1 | 2 | 3)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  ← Anterior
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/users-list')}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              
              {state.step < 3 ? (
                <button
                  onClick={() => {
                    if (validateCurrentStep()) {
                      handleStepChange((state.step + 1) as 1 | 2 | 3);
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Próximo →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={createLoading || updateLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {createLoading || updateLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </span>
                  ) : (
                    `💾 ${state.mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>T7 - Scaffolding: Página FORM implementada com useUsers hook ✅</p>
          <p className="mt-1">
            <strong>Funcionalidades:</strong> Multi-step Form, Validação, Criar/Editar, Metadata
          </p>
        </div>
      </div>
    </div>
  );
}