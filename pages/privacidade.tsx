import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShieldAlt, FaLock, FaEye, FaUserSecret, FaCookie, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../hooks/useLanguage';

const PrivacyPage: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const { language, changeLanguage, t, isLoaded } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLanguage: 'pt' | 'en') => {
    console.log('Privacy page - Button clicked for language:', newLanguage);
    if (changeLanguage && typeof changeLanguage === 'function') {
      changeLanguage(newLanguage);
    } else {
      console.error('changeLanguage function not available');
    }
  };

  if (!mounted && !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const privacyContent = {
    pt: {
      title: 'Política de Privacidade',
      subtitle: `Última atualização: ${new Date().toLocaleDateString('pt-BR')}`,
      backButton: 'Voltar ao Início',
      securityNotice: {
        title: 'Compromisso com a Privacidade',
        description: 'Sua privacidade é fundamental para nós. Utilizamos as mais avançadas tecnologias de criptografia e proteção de dados para garantir a segurança de suas informações.'
      },
      section1: {
        title: '1. Informações que Coletamos',
        personal: {
          title: 'Informações Pessoais',
          items: ['Nome completo', 'Endereço de email', 'Número de telefone', 'Dados de verificação de identidade (quando necessário)']
        },
        trading: {
          title: 'Informações de Trading',
          items: ['Chaves de API das exchanges (apenas com permissão de leitura e trading)', 'Histórico de operações', 'Preferências de trading', 'Performance e resultados']
        },
        technical: {
          title: 'Informações Técnicas',
          items: ['Endereço IP', 'Informações do dispositivo', 'Dados de navegação', 'Logs de sistema']
        }
      },
      section2: {
        title: '2. Como Usamos suas Informações',
        items: [
          { title: 'Prestação de Serviços:', description: 'Para executar operações de trading automatizado' },
          { title: 'Comunicação:', description: 'Para enviar atualizações importantes e suporte' },
          { title: 'Melhoria:', description: 'Para aprimorar nossos algoritmos e serviços' },
          { title: 'Segurança:', description: 'Para detectar e prevenir fraudes' },
          { title: 'Compliance:', description: 'Para cumprir obrigações legais e regulatórias' },
          { title: 'Análise:', description: 'Para gerar relatórios de performance (dados anonimizados)' }
        ]
      },
      section3: {
        title: '3. Proteção de Dados',
        items: [
          { icon: 'lock', title: 'Criptografia', description: 'Todas as informações são criptografadas em trânsito e em repouso usando padrões AES-256.' },
          { icon: 'shield', title: 'Acesso Restrito', description: 'Apenas pessoal autorizado tem acesso aos dados, com autenticação multifator obrigatória.' },
          { icon: 'user', title: 'Anonimização', description: 'Dados para análise são anonimizados e não podem ser vinculados a usuários específicos.' },
          { icon: 'eye', title: 'Auditoria', description: 'Todos os acessos são logados e auditados regularmente para garantir a integridade.' }
        ]
      },
      section4: {
        title: '4. Compartilhamento de Dados',
        description: 'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:',
        items: [
          { title: 'Consentimento:', description: 'Quando você autoriza expressamente' },
          { title: 'Prestadores de Serviço:', description: 'Com fornecedores que nos ajudam a operar (sob acordo de confidencialidade)' },
          { title: 'Obrigações Legais:', description: 'Quando exigido por lei ou ordem judicial' },
          { title: 'Segurança:', description: 'Para proteger nossos direitos e prevenir fraudes' }
        ]
      },
      section5: {
        title: '5. Cookies e Tecnologias Similares',
        description: 'Utilizamos cookies para melhorar sua experiência, manter sua sessão segura e analisar o uso da plataforma. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.',
        types: 'Tipos de cookies que utilizamos: essenciais (necessários para funcionamento), funcionais (melhoram a experiência), analíticos (nos ajudam a entender o uso) e de marketing (para conteúdo relevante).'
      },
      section6: {
        title: '6. Seus Direitos',
        description: 'Você tem os seguintes direitos em relação aos seus dados:',
        items: [
          { title: 'Acesso:', description: 'Solicitar uma cópia dos seus dados' },
          { title: 'Retificação:', description: 'Corrigir informações incorretas' },
          { title: 'Exclusão:', description: 'Solicitar a remoção dos seus dados' },
          { title: 'Portabilidade:', description: 'Receber seus dados em formato legível por máquina' },
          { title: 'Oposição:', description: 'Opor-se ao processamento para marketing' },
          { title: 'Restrição:', description: 'Limitar o processamento em certas circunstâncias' }
        ]
      },
      section7: {
        title: '7. Retenção de Dados',
        description: 'Mantemos seus dados apenas pelo tempo necessário para cumprir os propósitos descritos nesta política ou conforme exigido por lei. Dados de trading podem ser mantidos por períodos mais longos para fins de auditoria e compliance.'
      },
      section8: {
        title: '8. Transferências Internacionais',
        description: 'Seus dados podem ser processados em servidores localizados fora do Brasil. Nestes casos, garantimos que há proteções adequadas e que os dados são tratados com o mesmo nível de proteção exigido pela LGPD.'
      },
      section9: {
        title: '9. Menores de Idade',
        description: 'Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se tomarmos conhecimento de dados de menores, os removeremos imediatamente.'
      },
      section10: {
        title: '10. Alterações nesta Política',
        description: 'Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através da plataforma ou por email. Recomendamos revisar esta política regularmente.'
      },
      section11: {
        title: '11. Contato e DPO',
        description: 'Para questões sobre privacidade, exercer seus direitos ou entrar em contato com nosso Encarregado de Proteção de Dados (DPO):',
        contacts: 'Email: privacy@coinbitclub.com\nSuporte: Através da plataforma\nDPO: dpo@coinbitclub.com'
      },
      cta: {
        title: 'Suas informações estão seguras conosco',
        description: 'Priorizamos a proteção dos seus dados com os mais altos padrões de segurança.',
        createAccount: 'Criar Conta Segura',
        viewTerms: 'Ver Termos de Uso'
      },
      footer: '© 2024 CoinBitClub. Todos os direitos reservados.'
    },
    en: {
      title: 'Privacy Policy',
      subtitle: `Last updated: ${new Date().toLocaleDateString('en-US')}`,
      backButton: 'Back to Home',
      securityNotice: {
        title: 'Privacy Commitment',
        description: 'Your privacy is fundamental to us. We use the most advanced encryption and data protection technologies to ensure the security of your information.'
      },
      section1: {
        title: '1. Information We Collect',
        personal: {
          title: 'Personal Information',
          items: ['Full name', 'Email address', 'Phone number', 'Identity verification data (when necessary)']
        },
        trading: {
          title: 'Trading Information',
          items: ['Exchange API keys (read and trading permissions only)', 'Trading history', 'Trading preferences', 'Performance and results']
        },
        technical: {
          title: 'Technical Information',
          items: ['IP address', 'Device information', 'Browsing data', 'System logs']
        }
      },
      section2: {
        title: '2. How We Use Your Information',
        items: [
          { title: 'Service Provision:', description: 'To execute automated trading operations' },
          { title: 'Communication:', description: 'To send important updates and support' },
          { title: 'Improvement:', description: 'To enhance our algorithms and services' },
          { title: 'Security:', description: 'To detect and prevent fraud' },
          { title: 'Compliance:', description: 'To comply with legal and regulatory obligations' },
          { title: 'Analysis:', description: 'To generate performance reports (anonymized data)' }
        ]
      },
      section3: {
        title: '3. Data Protection',
        items: [
          { icon: 'lock', title: 'Encryption', description: 'All information is encrypted in transit and at rest using AES-256 standards.' },
          { icon: 'shield', title: 'Restricted Access', description: 'Only authorized personnel have data access, with mandatory multi-factor authentication.' },
          { icon: 'user', title: 'Anonymization', description: 'Analysis data is anonymized and cannot be linked to specific users.' },
          { icon: 'eye', title: 'Auditing', description: 'All access is logged and regularly audited to ensure integrity.' }
        ]
      },
      section4: {
        title: '4. Data Sharing',
        description: 'We do not sell, rent, or share your personal information with third parties, except in the following situations:',
        items: [
          { title: 'Consent:', description: 'When you expressly authorize' },
          { title: 'Service Providers:', description: 'With vendors who help us operate (under confidentiality agreement)' },
          { title: 'Legal Obligations:', description: 'When required by law or court order' },
          { title: 'Security:', description: 'To protect our rights and prevent fraud' }
        ]
      },
      section5: {
        title: '5. Cookies and Similar Technologies',
        description: 'We use cookies to improve your experience, keep your session secure, and analyze platform usage. You can manage your cookie preferences in your browser settings.',
        types: 'Types of cookies we use: essential (necessary for functionality), functional (improve experience), analytical (help us understand usage), and marketing (for relevant content).'
      },
      section6: {
        title: '6. Your Rights',
        description: 'You have the following rights regarding your data:',
        items: [
          { title: 'Access:', description: 'Request a copy of your data' },
          { title: 'Rectification:', description: 'Correct incorrect information' },
          { title: 'Deletion:', description: 'Request removal of your data' },
          { title: 'Portability:', description: 'Receive your data in machine-readable format' },
          { title: 'Opposition:', description: 'Object to processing for marketing' },
          { title: 'Restriction:', description: 'Limit processing under certain circumstances' }
        ]
      },
      section7: {
        title: '7. Data Retention',
        description: 'We keep your data only for the time necessary to fulfill the purposes described in this policy or as required by law. Trading data may be kept for longer periods for audit and compliance purposes.'
      },
      section8: {
        title: '8. International Transfers',
        description: 'Your data may be processed on servers located outside Brazil. In these cases, we ensure adequate protections and that data is treated with the same level of protection required by LGPD.'
      },
      section9: {
        title: '9. Minors',
        description: 'Our services are not intended for individuals under 18 years old. We do not intentionally collect information from minors. If we become aware of minor data, we will remove it immediately.'
      },
      section10: {
        title: '10. Changes to This Policy',
        description: 'We may update this policy periodically. We will notify about significant changes through the platform or by email. We recommend reviewing this policy regularly.'
      },
      section11: {
        title: '11. Contact and DPO',
        description: 'For privacy questions, exercising your rights, or contacting our Data Protection Officer (DPO):',
        contacts: 'Email: privacy@coinbitclub.com\nSupport: Through the platform\nDPO: dpo@coinbitclub.com'
      },
      cta: {
        title: 'Your information is safe with us',
        description: 'We prioritize the protection of your data with the highest security standards.',
        createAccount: 'Create Secure Account',
        viewTerms: 'View Terms of Use'
      },
      footer: '© 2024 CoinBitClub. All rights reserved.'
    }
  };

  const content = privacyContent[language];

  return (
    <>
      <Head>
        <title>{content.title} - CoinBitClub MarketBot</title>
        <meta name="description" content={language === 'pt' ? 'Política de Privacidade e Proteção de Dados do CoinBitClub MarketBot' : 'Privacy Policy and Data Protection of CoinBitClub MarketBot'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/home" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-white">CoinBitClub</span>
              </Link>

              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                  <FaGlobe className="text-gray-400" />
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value as 'pt' | 'en')}
                    className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
                  >
                    <option value="pt" className="bg-gray-800">Português</option>
                    <option value="en" className="bg-gray-800">English</option>
                  </select>
                </div>

                <Link
                  href="/home"
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <FaArrowLeft />
                  {content.backButton}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="text-2xl text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
              <p className="text-gray-300 text-lg">
                {content.subtitle}
              </p>
            </div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <FaLock className="text-2xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{content.securityNotice.title}</h3>
                  <p className="text-gray-300">
                    {content.securityNotice.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 space-y-8"
            >
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section1.title}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">{content.section1.personal.title}</h3>
                    <ul className="text-gray-300 space-y-1 pl-6">
                      {content.section1.personal.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">{content.section1.trading.title}</h3>
                    <ul className="text-gray-300 space-y-1 pl-6">
                      {content.section1.trading.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">{content.section1.technical.title}</h3>
                    <ul className="text-gray-300 space-y-1 pl-6">
                      {content.section1.technical.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section2.title}</h2>
                <ul className="text-gray-300 space-y-2 pl-6">
                  {content.section2.items.map((item, index) => (
                    <li key={index}>• <strong>{item.title}</strong> {item.description}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section3.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.section3.items.map((item, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {item.icon === 'lock' && <FaLock className="text-blue-400" />}
                        {item.icon === 'shield' && <FaShieldAlt className="text-green-400" />}
                        {item.icon === 'user' && <FaUserSecret className="text-purple-400" />}
                        {item.icon === 'eye' && <FaEye className="text-orange-400" />}
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section4.title}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {content.section4.description}
                </p>
                <ul className="text-gray-300 space-y-2 pl-6">
                  {content.section4.items.map((item, index) => (
                    <li key={index}>• <strong>{item.title}</strong> {item.description}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section5.title}</h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <FaCookie className="text-blue-400 text-xl flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-blue-200 leading-relaxed">
                        {content.section5.description}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {content.section5.types}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section6.title}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {content.section6.description}
                </p>
                <ul className="text-gray-300 space-y-2 pl-6">
                  {content.section6.items.map((item, index) => (
                    <li key={index}>• <strong>{item.title}</strong> {item.description}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section7.title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {content.section7.description}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section8.title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {content.section8.description}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section9.title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {content.section9.description}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section10.title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {content.section10.description}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">{content.section11.title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {content.section11.description}
                </p>
                <div className="bg-gray-700/30 rounded-lg p-4 mt-4">
                  <p className="text-gray-300 whitespace-pre-line">
                    {content.section11.contacts}
                  </p>
                </div>
              </section>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-12"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {content.cta.title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {content.cta.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/cadastro"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-all"
                  >
                    {content.cta.createAccount}
                  </Link>
                  <Link
                    href="/termos"
                    className="border border-green-500/50 text-green-400 hover:bg-green-500/10 font-bold px-8 py-3 rounded-xl transition-all"
                  >
                    {content.cta.viewTerms}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900/80 border-t border-gray-700/30 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-400">
              <p>{content.footer}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPage;
