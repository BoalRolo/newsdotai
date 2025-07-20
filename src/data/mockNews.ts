import type { NewsArticle } from "../types/news";

// Dados mock para diferentes tópicos
export const mockNewsData: Record<string, NewsArticle[]> = {
  sportingcp: [
    {
      title: "Sporting CP vence Benfica por 2-1 no derby de Lisboa",
      description:
        "O Sporting CP conquistou uma vitória importante no derby de Lisboa, vencendo o Benfica por 2-1 com golos de Viktor Gyökeres e Pedro Gonçalves. A equipa de Rúben Amorim mantém a liderança da Liga.",
      link: "https://www.record.pt/futebol/futebol-nacional/liga-bwin/sporting/detalhe/sporting-vence-benfica-2-1-no-derby-de-lisboa",
      publishedAt: "2025-01-20T15:30:00.000Z",
      source_name: "Record",
      source_url: "https://www.record.pt",
      image_url:
        "https://cdn.record.pt/images/2025-01/sporting-benfica-derby.jpg",
      category: ["sports"],
      country: ["portugal"],
      language: "portuguese",
    },
    {
      title: "Gyökeres marca hat-trick na vitória do Sporting sobre o Porto",
      description:
        "Viktor Gyökeres foi o herói da noite ao marcar três golos na vitória do Sporting por 3-0 sobre o FC Porto. O avançado sueco está em excelente forma esta temporada.",
      link: "https://www.ojogo.pt/futebol/1a-liga/sporting/noticias/gyokeres-hat-trick-sporting-porto",
      publishedAt: "2025-01-19T20:15:00.000Z",
      source_name: "O Jogo",
      source_url: "https://www.ojogo.pt",
      image_url: "https://cdn.ojogo.pt/images/2025-01/gyokeres-hat-trick.jpg",
      category: ["sports"],
      country: ["portugal"],
      language: "portuguese",
    },
    {
      title: "Sporting CP anuncia renovação de contrato de Rúben Amorim",
      description:
        "O Sporting CP anunciou hoje a renovação do contrato do treinador Rúben Amorim até 2027. O técnico português continuará à frente da equipa leonina.",
      link: "https://www.abola.pt/futebol/2025-01-18/sporting-renova-amorim-ate-2027",
      publishedAt: "2025-01-18T12:00:00.000Z",
      source_name: "A Bola",
      source_url: "https://www.abola.pt",
      image_url: "https://cdn.abola.pt/images/2025-01/amorim-renovacao.jpg",
      category: ["sports"],
      country: ["portugal"],
      language: "portuguese",
    },
  ],
  technology: [
    {
      title:
        "Apple anuncia novo iPhone 17 com inteligência artificial avançada",
      description:
        "A Apple revelou o novo iPhone 17 com capacidades de IA integradas, incluindo processamento de linguagem natural e reconhecimento de imagem melhorado. O dispositivo chega às lojas em setembro.",
      link: "https://www.theverge.com/2025/01/20/apple-iphone-17-ai-features",
      publishedAt: "2025-01-20T14:00:00.000Z",
      source_name: "The Verge",
      source_url: "https://www.theverge.com",
      image_url: "https://cdn.vox-cdn.com/thumbor/iphone17-ai.jpg",
      category: ["technology"],
      country: ["united states"],
      language: "english",
    },
    {
      title: "OpenAI lança GPT-5 com capacidades multimodais revolucionárias",
      description:
        "A OpenAI anunciou o lançamento do GPT-5, a versão mais avançada do seu modelo de linguagem. A nova versão inclui capacidades multimodais e melhor compreensão contextual.",
      link: "https://techcrunch.com/2025/01/19/openai-gpt5-multimodal",
      publishedAt: "2025-01-19T16:30:00.000Z",
      source_name: "TechCrunch",
      source_url: "https://techcrunch.com",
      image_url:
        "https://techcrunch.com/wp-content/uploads/gpt5-announcement.jpg",
      category: ["technology"],
      country: ["united states"],
      language: "english",
    },
    {
      title:
        "Tesla revela novo modelo de carro elétrico com autonomia de 800km",
      description:
        "A Tesla apresentou o seu mais recente modelo de carro elétrico com uma autonomia impressionante de 800km. O veículo também inclui tecnologia de condução autónoma de nível 4.",
      link: "https://www.engadget.com/tesla-new-ev-800km-range",
      publishedAt: "2025-01-18T10:15:00.000Z",
      source_name: "Engadget",
      source_url: "https://www.engadget.com",
      image_url: "https://o.aolcdn.com/images/tesla-new-model.jpg",
      category: ["technology"],
      country: ["united states"],
      language: "english",
    },
  ],
  business: [
    {
      title: "Bitcoin atinge novo máximo histórico de $100,000",
      description:
        "O Bitcoin atingiu um novo máximo histórico de $100,000, impulsionado pela adoção institucional e regulamentação mais clara nos Estados Unidos. A criptomoeda lidera um rally no mercado digital.",
      link: "https://www.bloomberg.com/news/articles/bitcoin-100k-record",
      publishedAt: "2025-01-20T13:45:00.000Z",
      source_name: "Bloomberg",
      source_url: "https://www.bloomberg.com",
      image_url: "https://assets.bwbx.io/bitcoin-chart.jpg",
      category: ["business"],
      country: ["united states"],
      language: "english",
    },
    {
      title: "Microsoft anuncia aquisição de startup de IA por $10 mil milhões",
      description:
        "A Microsoft anunciou a aquisição de uma startup especializada em inteligência artificial por $10 mil milhões. A aquisição reforça a posição da empresa no mercado de IA.",
      link: "https://www.reuters.com/microsoft-ai-startup-acquisition",
      publishedAt: "2025-01-19T09:20:00.000Z",
      source_name: "Reuters",
      source_url: "https://www.reuters.com",
      image_url: "https://www.reuters.com/pf/resources/microsoft-ai.jpg",
      category: ["business"],
      country: ["united states"],
      language: "english",
    },
    {
      title: "Amazon lança novo serviço de entrega por drone em Portugal",
      description:
        "A Amazon anunciou o lançamento do seu serviço de entrega por drone em Portugal, começando por Lisboa. O serviço promete entregas em menos de 30 minutos.",
      link: "https://www.publico.pt/2025/01/18/amazon-drone-delivery-portugal",
      publishedAt: "2025-01-18T11:30:00.000Z",
      source_name: "Público",
      source_url: "https://www.publico.pt",
      image_url: "https://imagens.publico.pt/amazon-drone.jpg",
      category: ["business"],
      country: ["portugal"],
      language: "portuguese",
    },
  ],
  politics: [
    {
      title:
        "Eleições presidenciais em Portugal: candidatos apresentam propostas",
      description:
        "Os candidatos às eleições presidenciais em Portugal apresentaram as suas propostas principais. A campanha eleitoral aquece com debates televisivos marcados para as próximas semanas.",
      link: "https://www.dn.pt/politica/eleicoes-presidenciais-candidatos-propostas",
      publishedAt: "2025-01-20T12:00:00.000Z",
      source_name: "Diário de Notícias",
      source_url: "https://www.dn.pt",
      image_url: "https://cdn.dn.pt/images/eleicoes-presidenciais.jpg",
      category: ["politics"],
      country: ["portugal"],
      language: "portuguese",
    },
    {
      title: "União Europeia aprova novo pacote de medidas climáticas",
      description:
        "A União Europeia aprovou um novo pacote de medidas climáticas ambicioso, incluindo metas de redução de emissões de 55% até 2030. O acordo foi celebrado como um marco histórico.",
      link: "https://www.euractiv.com/eu-climate-package-approved",
      publishedAt: "2025-01-19T15:45:00.000Z",
      source_name: "EURACTIV",
      source_url: "https://www.euractiv.com",
      image_url: "https://www.euractiv.com/wp-content/uploads/eu-climate.jpg",
      category: ["politics"],
      country: ["belgium"],
      language: "english",
    },
    {
      title: "NATO anuncia exercícios militares conjuntos no Báltico",
      description:
        "A NATO anunciou a realização de exercícios militares conjuntos no Mar Báltico com a participação de 15 países membros. Os exercícios visam demonstrar a unidade da aliança.",
      link: "https://www.nato.int/cps/en/natohq/news_baltic-exercises",
      publishedAt: "2025-01-18T08:30:00.000Z",
      source_name: "NATO",
      source_url: "https://www.nato.int",
      image_url: "https://www.nato.int/images/baltic-exercises.jpg",
      category: ["politics"],
      country: ["belgium"],
      language: "english",
    },
  ],
  entertainment: [
    {
      title: "Festival de Cannes anuncia programação para 2025",
      description:
        "O Festival de Cannes revelou a programação oficial para a edição de 2025, com filmes de realizadores consagrados e estreantes. O festival decorre de 14 a 25 de maio.",
      link: "https://www.variety.com/cannes-2025-lineup",
      publishedAt: "2025-01-20T10:15:00.000Z",
      source_name: "Variety",
      source_url: "https://www.variety.com",
      image_url: "https://variety.com/wp-content/uploads/cannes-2025.jpg",
      category: ["entertainment"],
      country: ["france"],
      language: "english",
    },
    {
      title: "Taylor Swift anuncia nova tour mundial para 2025",
      description:
        "Taylor Swift anunciou uma nova tour mundial para 2025, incluindo datas em Portugal. A cantora promete um espetáculo ainda mais impressionante que o anterior.",
      link: "https://www.billboard.com/taylor-swift-2025-tour",
      publishedAt: "2025-01-19T14:20:00.000Z",
      source_name: "Billboard",
      source_url: "https://www.billboard.com",
      image_url:
        "https://www.billboard.com/wp-content/uploads/taylor-swift-tour.jpg",
      category: ["entertainment"],
      country: ["united states"],
      language: "english",
    },
    {
      title: "Netflix anuncia nova série portuguesa com atores internacionais",
      description:
        "A Netflix anunciou uma nova série portuguesa com atores internacionais. A produção será filmada em Lisboa e Porto, com estreia prevista para 2026.",
      link: "https://www.expresso.pt/cultura/netflix-serie-portuguesa",
      publishedAt: "2025-01-18T16:00:00.000Z",
      source_name: "Expresso",
      source_url: "https://www.expresso.pt",
      image_url: "https://cdn.expresso.pt/images/netflix-portugal.jpg",
      category: ["entertainment"],
      country: ["portugal"],
      language: "portuguese",
    },
  ],
};

// Função para obter dados mock para um tópico específico
export const getMockNewsForTopic = (topic: string): NewsArticle[] => {
  return mockNewsData[topic.toLowerCase()] || [];
};

// Função para obter todos os tópicos disponíveis
export const getAvailableMockTopics = (): string[] => {
  return Object.keys(mockNewsData);
};
