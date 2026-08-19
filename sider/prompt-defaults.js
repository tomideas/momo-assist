/* Shared default system prompt definitions */

// ⚠️ IMPORTANT: When modifying DEFAULT_PROMPTS, keep this file as the single source of truth.

const PROMPTS_VERSION = 10; // Increment when DEFAULT_PROMPTS change
const PROMPT_SUGGESTIONS_VERSION = 5; // Increment when DEFAULT_PROMPT_SUGGESTIONS change

const DEFAULT_PROMPT_ID = '1';
const REMOVED_DEFAULT_PROMPT_IDS = ['2', '3', '4', '5'];

const PROMPT_ID_MIGRATION = {
  default:'1',
  translator:'2',
  coder:'3',
  writer:'4',
  '1':'1',
  '2':'2',
  '3':'3',
  '4':'4',
  '5':'5'
};

const DEFAULT_PROMPTS = [
  { id:'1', name:'MoMo', visible:true, replyLanguage:'inherit', prompt:`You are Momo, a warm, helpful, and practical AI assistant.

Personality:
- Friendly, calm, and concise.
- Slightly playful when appropriate, but never distracting.
- Use emojis sparingly and only when they help the tone.

Guidelines:
- Reply in the user's language unless they ask otherwise.
- Be accurate and useful. If something is uncertain, say so instead of guessing.
- Adapt to the user's task: explain, summarize, translate, rewrite, brainstorm, compare, or troubleshoot as needed.` }
];

const DEFAULT_PROMPT_SUGGESTIONS = [
  {
    id:'fun-fact',
    title:'Translate',
    titleHant:'翻譯',
    titleHans:'翻译',
    outputLanguage:'inherit',
    prompt:'Translate this naturally. Preserve the original meaning, tone, formatting, names, links, and technical terms.'
  },
  {
    id:'impressive-line',
    title:'Summarize',
    titleHant:'摘要',
    titleHans:'总结',
    outputLanguage:'inherit',
    prompt:'Summarize this clearly in concise bullet points. Keep only the key ideas, decisions, and action items.'
  },
  {
    id:'deep-line',
    title:'Improve writing',
    titleHant:'潤飾文字',
    titleHans:'润色文字',
    outputLanguage:'inherit',
    prompt:'Rewrite this to be clearer, smoother, and more polished. Keep the original meaning, but improve structure, wording, and readability.'
  },
  {
    id:'continue-writing',
    title:'Continue writing',
    titleHant:'繼續寫作',
    titleHans:'继续写作',
    outputLanguage:'inherit',
    prompt:'Continue writing from this text in the same style and tone. Keep it coherent, natural, and directly connected to what came before.'
  },
  {
    id:'outline',
    title:'Outline',
    titleHant:'建立大綱',
    titleHans:'创建大纲',
    outputLanguage:'inherit',
    prompt:'Create a clear outline for this topic or draft. Organize the main points, supporting details, and suggested structure.'
  }
];

function cloneDefaultPrompts(){
  return DEFAULT_PROMPTS.map(p=>({ ...p }));
}

function cloneDefaultPromptSuggestions(){
  return DEFAULT_PROMPT_SUGGESTIONS.map(s=>({ ...s }));
}

function localizePromptSuggestionTitle(item, lang){
  if(!item || typeof item!=='object') return '';
  if(lang === 'hant' && item.titleHant) return item.titleHant;
  if(lang === 'hans' && item.titleHans) return item.titleHans;
  return item.title || item.prompt || '';
}

function migratePromptIds(list, selected){
  if(!Array.isArray(list)) return { prompts:list, selected, changed:false };
  let changed=false;
  const migrated=list.map(item=>{
    if(!item || typeof item!=='object') return item;
    const newId=PROMPT_ID_MIGRATION[item.id] || item.id;
    if(newId!==item.id) changed=true;
    return { ...item, id:newId };
  });
  let nextSelected=selected;
  if(selected && PROMPT_ID_MIGRATION[selected]){
    const converted=PROMPT_ID_MIGRATION[selected];
    if(converted!==selected){
      nextSelected=converted;
      changed=true;
    }
  }
  if(!nextSelected && migrated.length){
    nextSelected=migrated[0].id;
  }
  return { prompts:migrated, selected:nextSelected, changed };
}
