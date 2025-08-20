import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMail, FiArrowLeft, FiLoader, FiCheck } from 'react-icons/fi';

export default function EsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // Validação de email
      if (!email) {
        throw new Error('Por favor, insira seu email');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Por favor, insira um email válido');
      }

      // Enviar solicitação para o backend
      const response = await fetch('/api/auth/esqueci-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao enviar email de recuperação');
      }

      setSucesso(true);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Esqueci Minha Senha - CoinbitClub MarketBot</title>
        <meta
          name="description"
          content="Recupere o acesso à sua conta CoinbitClub MarketBot Premium"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative flex min-h-screen items-center justify-center p-8">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10"></div>
          <div className="absolute left-1/4 top-1/4 size-96 animate-pulse rounded-full bg-emerald-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 size-96 animate-pulse rounded-full bg-teal-500/20 blur-3xl delay-1000"></div>

          {/* Card Principal */}
          <div className="relative z-10 w-full max-w-md">
            <div className="premium-card">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500">
                    <FiMail className="size-8 text-black" />
                  </div>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-white">
                  Esqueci Minha Senha
                </h1>
                <p className="text-slate-400">
                  Digite seu email para receber um link de recuperação
                </p>
              </div>

              {sucesso ? (
                /* Tela de Sucesso */
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20">
                      <FiCheck className="size-8 text-emerald-400" />
                    </div>
                  </div>
                  <h2 className="mb-4 text-xl font-semibold text-emerald-400">
                    Email Enviado!
                  </h2>
                  <p className="mb-6 text-slate-300">
                    Se uma conta com este email existir, você receberá um link para redefinir sua senha.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => setSucesso(false)}
                      className="premium-button w-full"
                    >
                      Enviar Novamente
                    </button>
                    <Link
                      href="/auth"
                      className="inline-flex w-full items-center justify-center text-sm text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      <FiArrowLeft className="mr-1 size-4" />
                      Voltar ao Login
                    </Link>
                  </div>
                </div>
              ) : (
                /* Formulário */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {erro && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                      <p className="text-sm text-red-400">{erro}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="premium-input pl-10"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="premium-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <FiLoader className="mr-2 size-4 animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      'Enviar Link de Recuperação'
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/auth"
                      className="inline-flex items-center text-sm text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      <FiArrowLeft className="mr-1 size-4" />
                      Voltar ao Login
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Links Adicionais */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Precisa de ajuda?{' '}
                <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">
                  Entre em contato
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
