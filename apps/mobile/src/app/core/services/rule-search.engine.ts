import { RuleDocument, RuleSearchResult, SearchConfidence } from '../models/rule.model';

const STOP_WORDS = new Set([
  'a', 'as', 'at', 'como', 'com', 'da', 'de', 'do', 'e', 'em', 'funciona', 'o', 'os', 'para', 'por', 'que', 'the', 'uma', 'um', 'what', 'with', 'how', 'is', 'does', 'can', 'i', 'my', 'to', 'of', 'and', 'or', 'on', 'in', 'this', 'that', 'uma', 'um',
]);

const TERM_ALIASES: Record<string, string[]> = {
  atropelar: ['trample'],
  trample: ['atropelar'],
  'toque mortifero': ['deathtouch'],
  deathtouch: ['toque mortifero'],
  vigilancia: ['vigilance'],
  vigilance: ['vigilancia'],
  'vinculo com a vida': ['lifelink'],
  lifelink: ['vinculo com a vida'],
  pilha: ['stack'],
  stack: ['pilha'],
  exilar: ['exile'],
  exile: ['exilar'],
  anular: ['counter'],
  counterar: ['counter'],
  counter: ['anular', 'counterar'],
  etb: ['enters the battlefield', 'enter the battlefield'],
  trigger: ['triggered ability'],
  morrer: ['dies', 'graveyard from the battlefield'],
};

const SUMMARY_BY_TERM: Record<string, string> = {
  trample: 'Atropelar permite que uma criatura atacante atribua dano excedente ao jogador, planeswalker ou batalha atacado depois de atribuir dano letal às criaturas bloqueadoras.',
  deathtouch: 'Toque mortífero faz com que qualquer quantidade de dano de combate causada por essa fonte seja considerada dano letal para uma criatura.',
  vigilance: 'Vigilância permite que uma criatura ataque sem ser virada.',
  lifelink: 'Vínculo com a vida faz o controlador da fonte ganhar vida ao mesmo tempo que ela causa dano.',
  stack: 'A pilha organiza mágicas e habilidades. Em geral, jogadores recebem prioridade para responder antes que o objeto no topo resolva.',
  exile: 'Exilar move um objeto para a zona de exílio; ele deixa a zona anterior e passa a ser um novo objeto ao retornar, salvo exceções.',
};

export const normalizeRuleText = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9.]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const getTerms = (query: string): string[] => {
  const normalized = normalizeRuleText(query);
  const words = normalized.split(' ').filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  const terms = new Set(words);

  for (const [phrase, aliases] of Object.entries(TERM_ALIASES)) {
    if (normalized.includes(phrase)) {
      terms.add(phrase);
      aliases.forEach((alias) => terms.add(alias));
    }
  }

  return [...terms];
};

const confidenceFor = (score: number): SearchConfidence => score >= 18 ? 'high' : score >= 10 ? 'medium' : 'low';

const excerptFor = (text: string, terms: string[]): string => {
  const normalizedText = normalizeRuleText(text);
  const term = terms.find((candidate) => normalizedText.includes(candidate));
  if (!term) return text.slice(0, 260).trim();

  const position = normalizedText.indexOf(term);
  const start = Math.max(0, position - 90);
  const end = Math.min(text.length, position + term.length + 180);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
};

const summaryFor = (terms: string[]): string | undefined => terms
  .map((term) => SUMMARY_BY_TERM[term])
  .find((summary) => Boolean(summary));

export const summaryForRule = (rule: RuleDocument): string | undefined => summaryFor([
  normalizeRuleText(rule.title),
  ...Object.keys(SUMMARY_BY_TERM).filter((term) => normalizeRuleText(rule.text).includes(term)),
]);

export const searchRules = (rules: RuleDocument[], query: string, limit = 10): RuleSearchResult[] => {
  const normalizedQuery = normalizeRuleText(query);
  if (!normalizedQuery) return [];

  const terms = getTerms(query);
  const exactId = /^\d{3}\.\d+(?:[a-z])?$/.test(normalizedQuery) ? normalizedQuery : undefined;

  return rules
    .map((rule) => {
      const id = normalizeRuleText(rule.id);
      const title = normalizeRuleText(rule.title);
      const text = normalizeRuleText(rule.text);
      let score = exactId === id ? 100 : 0;
      const matchedTerms = new Set<string>();

      if (title.includes(normalizedQuery)) score += 30;
      if (text.includes(normalizedQuery)) score += 12;

      for (const term of terms) {
        if (id === term) {
          score += 100;
          matchedTerms.add(term);
        }
        if (title.includes(term)) {
          score += 15;
          matchedTerms.add(term);
        }
        if (text.includes(term)) {
          score += 4;
          matchedTerms.add(term);
        }
      }

      return {
        ...rule,
        score,
        confidence: confidenceFor(score),
        matchedTerms: [...matchedTerms],
        excerpt: excerptFor(rule.text, terms),
        summary: summaryFor(terms),
      };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id, undefined, { numeric: true }))
    .slice(0, limit);
};
