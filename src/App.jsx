import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen, CheckCircle, PenTool, BarChart3, AlertCircle, Trash2,
  BookMarked, Target, CalendarDays, Download, Upload, Check, X,
  Edit3, Clock, ChevronRight, ChevronDown, Menu, Home, Plus,
  Bell, Moon, User
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const EDITAL_DATA = [
  {
    id: 'portugues',
    title: '1. Língua Portuguesa',
    topics: [
      'Compreensão e interpretação de textos', 'Gêneros e tipos de texto', 'Significação das palavras',
      'Figuras de sintaxe', 'Figuras de linguagem', 'Articulação textual: operadores sequenciais e expressões referenciais',
      'Coesão e coerência textual', 'Identificação, definição, classificação, flexão e emprego das classes de palavras',
      'Formação de palavras', 'Verbos: flexão, conjugação, vozes, correlação entre tempos e modos verbais',
      'Concordância verbal e nominal', 'Regência verbal e nominal', 'Crase', 'Colocação pronominal',
      'Estrutura da oração e do período: aspectos sintáticos e semânticos', 'Acentuação gráfica',
      'Ortografia', 'Pontuação', 'Variação linguística'
    ]
  },
  {
    id: 'raciocinio',
    title: '2. Raciocínio Lógico',
    topics: [
      'Conjuntos numéricos: naturais, inteiros, racionais e reais', 'Operações de adição, subtração, multiplicação, divisão, potenciação e radiciação',
      'Números decimais', 'Valor absoluto', 'Propriedades dos números naturais', 'Decomposição de número natural em fatores primos',
      'Múltiplos e divisores', 'Máximo divisor comum (MDC) e mínimo múltiplo comum (MMC)', 'Razões e proporções',
      'Grandezas direta e inversamente proporcionais', 'Regra de três simples e composta', 'Porcentagem',
      'Grandezas e medidas: quantidade, tempo, comprimento, capacidade e massa', 'Equações do 1º grau',
      'Sistemas de equações do 1º grau', 'Função do 1º grau', 'Resolução de problemas', 'Média aritmética simples e ponderada',
      'Proposições simples e compostas', 'Conectivos lógicos', 'Tabelas-verdade', 'Negação de proposições',
      'Equivalências e implicações lógicas', 'Quantificadores', 'Argumentação lógica: premissas e conclusões',
      'Inferências', 'Análise e validade de argumentos', 'Diagramas lógicos', 'Linguagem dos conjuntos: notação e representação',
      'Elementos e relação de pertinência', 'Igualdade de conjuntos', 'Inclusão e subconjuntos', 'Conjunto unitário e conjunto vazio',
      'Conjunto universo e conjunto das partes', 'Conjuntos finitos e infinitos', 'Operações com conjuntos: união, interseção, diferença e complementar',
      'Sequências lógicas com números, letras, palavras e figuras', 'Problemas de associação lógica', 'Verdade e mentiras',
      'Análise combinatória: princípio fundamental da contagem', 'Arranjos, permutações e combinações',
      'Probabilidade: conceitos básicos e cálculo em espaços amostrais finitos', 'Problemas de raciocínio lógico e sequencial'
    ]
  },
  {
    id: 'atualidades',
    title: '3. Conhecimentos Gerais e Atualidades',
    topics: [
      'Fatos políticos, econômicos e sociais dos últimos cinco anos: Município, Estado, Brasil e mundo',
      'Fatos divulgados na mídia nacional e internacional', 'Movimentos artísticos, culturais e sociais do Município, Estado, Brasil e mundo',
      'Conhecimentos gerais e atualidades: aspectos geográficos, históricos, físicos, econômicos, sociais, políticos e estatísticos',
      'Noções de cidadania', 'Símbolos nacionais, estaduais e municipais', 'Economia', 'Ecologia e meio ambiente',
      'História e política', 'Justiça e segurança pública', 'Saúde e cultura', 'Educação e religião',
      'Qualidade de vida', 'Esportes e turismo', 'Georreferenciamento', 'Inovações tecnológicas e científicas do Município, Estado, Brasil e mundo',
      'Questões da realidade econômica, cultural, histórica, geográfica e socioambiental', 'Notícias em geral: site da Prefeitura de Porto Velho/RO'
    ]
  },
  {
    id: 'legislacao',
    title: '4. Legislação',
    topics: [
      'Lei Orgânica do Município de Porto Velho/RO e atualizações', 'Regime Jurídico dos Servidores Públicos Municipais de Porto Velho/RO — Lei Municipal nº 385/2010',
      'Plano de Carreira, Cargos e Remuneração dos Profissionais de Saúde — Lei Municipal nº 390/2010',
      'Lei Municipal nº 391/2010 e atualizações', 'Lei Brasileira de Inclusão da Pessoa com Deficiência — Estatuto da Pessoa com Deficiência',
      'Constituição Federal: Título I — Dos Princípios Fundamentais', 'Constituição Federal: Título II — Dos Direitos e Garantias Fundamentais, arts. 5º ao 13',
      'Constituição Federal: Título III — Da Organização do Estado', 'Constituição Federal: Capítulo IV — Dos Municípios: arts. 29, 29-A, 30 e 31',
      'Constituição Federal: Capítulo VII — Da Administração Pública: arts. 37, 38 e 39', 'Lei de Licitações e Pregão — Lei Federal nº 14.133/2021',
      'Lei de Acesso à Informação — Lei Federal nº 12.527/2011', 'Legislação estadual e municipal de acesso à informação'
    ]
  },
  {
    id: 'especificos',
    title: '5. Conhecimentos Específicos — ACS',
    topics: [
      'Constituição Federal: art. 196 a 200', 'Lei Federal nº 8.080/1990', 'Portaria Federal nº 2.436/2017',
      'Lei Federal nº 8.142/1990', 'Lei Federal nº 11.350/2006', 'Lei Federal nº 13.708/2018',
      'Lei Federal nº 13.595/2018', 'Sistema Único de Saúde (SUS): princípios fundamentais, diretrizes, atribuições e competências',
      'Organização da Atenção Básica no SUS', 'Atendimento individual e coletivo em relação à saúde pública e qualidade de vida',
      'Prevenção de doenças', 'Salubridade', 'Vacinação', 'Saneamento básico', 'Guia de Vigilância Epidemiológica — Covid-19',
      'Ética e cidadania', 'Política Nacional de Atenção Básica', 'Programa Bolsa Família e Cadastro Único',
      'Atribuições e competências do Agente Comunitário de Saúde', 'Ferramentas de trabalho do Agente Comunitário de Saúde',
      'O trabalho do Agente Comunitário de Saúde: visitas domiciliares', 'Atualização de cadastro da família e do domicílio',
      'Conhecimento do território', 'Noções de ética e cidadania', 'Ações de educação em saúde na Estratégia de Saúde da Família',
      'Participação do ACS em atividades coletivas'
    ]
  }
];

// ---------- Armazenamento persistente ----------
// Grava em DOIS lugares: localStorage + arquivo na memória interna do app (Directory.Data).
const DATA_FILE = 'estudei-dados.json';
const LS = {
  progress: 'acs_study_progress_v2',
  exercises: 'acs_study_exercises_v2',
  schedule: 'acs_study_schedule_v2'
};

async function loadAll() {
  if (Capacitor.isNativePlatform()) {
    try {
      const r = await Filesystem.readFile({ path: DATA_FILE, directory: Directory.Data, encoding: Encoding.UTF8 });
      const parsed = JSON.parse(r.data);
      if (parsed) return parsed;
    } catch (e) { /* arquivo ainda não existe: usa o localStorage */ }
  }
  try {
    return {
      progress: JSON.parse(localStorage.getItem(LS.progress) || 'null'),
      exercises: JSON.parse(localStorage.getItem(LS.exercises) || 'null'),
      schedule: JSON.parse(localStorage.getItem(LS.schedule) || 'null')
    };
  } catch (e) {
    return null;
  }
}

async function saveAll(data) {
  try {
    localStorage.setItem(LS.progress, JSON.stringify(data.progress));
    localStorage.setItem(LS.exercises, JSON.stringify(data.exercises));
    localStorage.setItem(LS.schedule, JSON.stringify(data.schedule));
  } catch (e) { /* ignora */ }
  if (Capacitor.isNativePlatform()) {
    try {
      await Filesystem.writeFile({
        path: DATA_FILE,
        data: JSON.stringify(data),
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    } catch (e) { console.error('Falha ao gravar arquivo', e); }
  }
}

const initialSchedule = {
  dom: { title: 'Dom', content: '' },
  seg: { title: 'Seg', content: '' },
  ter: { title: 'Ter', content: '' },
  qua: { title: 'Qua', content: '' },
  qui: { title: 'Qui', content: '' },
  sex: { title: 'Sex', content: '' },
  sab: { title: 'Sáb', content: '' }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const [exercises, setExercises] = useState([]);
  const [schedule, setSchedule] = useState(initialSchedule);

  const [formCategory, setFormCategory] = useState('Teoria');
  const [formSubject, setFormSubject] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formTotal, setFormTotal] = useState('');
  const [formErrors, setFormErrors] = useState('');
  const [formTime, setFormTime] = useState(''); // Tempo em minutos

  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [isScheduleSaved, setIsScheduleSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const latest = useRef({ progress: {}, exercises: [], schedule: initialSchedule });
  latest.current = { progress, exercises, schedule };

  // Carrega ao abrir o app
  useEffect(() => {
    (async () => {
      const d = await loadAll();
      if (d) {
        if (d.progress) setProgress(d.progress);
        if (d.exercises) setExercises(d.exercises);
        if (d.schedule) setSchedule(d.schedule);
      }
      setLoaded(true);
    })();
  }, []);

  // Salva automaticamente 0,4 s depois de qualquer alteração (só depois de carregar,
  // para nunca sobrescrever os dados salvos com o estado vazio inicial)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => saveAll(latest.current), 400);
    return () => clearTimeout(t);
  }, [progress, exercises, schedule, loaded]);

  // Salva na hora ao minimizar / sair do app
  useEffect(() => {
    if (!loaded) return;
    const flush = () => saveAll(latest.current);
    const onVis = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', flush);
    };
  }, [loaded]);

  const handleExport = async () => {
    const json = JSON.stringify({ progress, exercises, schedule });
    const fileName = 'meu_plano_acs.json';

    if (Capacitor.isNativePlatform()) {
      try {
        const res = await Filesystem.writeFile({
          path: fileName,
          data: json,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });
        await Share.share({
          title: 'Backup Estudei',
          text: 'Backup dos meus estudos',
          url: res.uri,
          dialogTitle: 'Salvar / enviar backup'
        });
      } catch (e) {
        if (!String(e).toLowerCase().includes('cancel')) alert('Erro ao exportar backup.');
      }
      return;
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.progress) setProgress(data.progress);
        if (data.exercises) setExercises(data.exercises);
        if (data.schedule) setSchedule(data.schedule);
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar arquivo.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const toggleTopic = (subjectId, topic) => {
    const key = `${subjectId}_${topic}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleScheduleChange = (day, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], content: value }
    }));
  };

  const handleSaveScheduleBtn = () => {
    saveAll(latest.current);
    setIsScheduleSaved(true);
    setTimeout(() => setIsScheduleSaved(false), 3000);
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!formSubject || !formTopic) return;

    const total = parseInt(formTotal) || 0;
    const errors = parseInt(formErrors) || 0;
    const time = parseInt(formTime) || 0;

    const newExercise = {
      id: Date.now(),
      date: new Date().toISOString(),
      category: formCategory,
      subjectId: formSubject,
      topic: formTopic,
      total: total,
      errors: errors,
      correct: total - errors,
      time: time
    };

    setExercises([newExercise, ...exercises]);
    setFormTotal('');
    setFormErrors('');
    setFormTime('');
    alert('Estudo registrado com sucesso!');
  };

  const deleteExercise = (id) => {
    if (window.confirm('Deseja apagar este registro?')) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0h00min';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, '0')}min`;
  };

  const stats = useMemo(() => {
    let totalQuestions = 0, totalErrors = 0, totalCorrect = 0, totalStudyTime = 0;
    const topicStats = {};
    const disciplineStats = {};

    EDITAL_DATA.forEach(sub => {
      disciplineStats[sub.id] = { id: sub.id, title: sub.title, total: 0, correct: 0, errors: 0, time: 0 };
    });

    exercises.forEach(ex => {
      totalQuestions += ex.total;
      totalErrors += ex.errors;
      totalCorrect += ex.correct;
      totalStudyTime += (ex.time || 0);

      const key = `${ex.subjectId}_${ex.topic}`;
      if (!topicStats[key]) {
        topicStats[key] = { total: 0, errors: 0, correct: 0, time: 0, lastDate: ex.date };
      }
      topicStats[key].total += ex.total;
      topicStats[key].errors += ex.errors;
      topicStats[key].correct += ex.correct;
      topicStats[key].time += (ex.time || 0);
      if (new Date(ex.date) > new Date(topicStats[key].lastDate)) topicStats[key].lastDate = ex.date;

      if (disciplineStats[ex.subjectId]) {
        disciplineStats[ex.subjectId].total += ex.total;
        disciplineStats[ex.subjectId].correct += ex.correct;
        disciplineStats[ex.subjectId].errors += ex.errors;
        disciplineStats[ex.subjectId].time += (ex.time || 0);
      }
    });

    const totalTopics = EDITAL_DATA.reduce((acc, curr) => acc + curr.topics.length, 0);
    const completedTopics = Object.values(progress).filter(Boolean).length;

    return {
      totalQuestions, totalErrors, totalCorrect, totalStudyTime,
      topicStats, disciplineStats, totalTopics, completedTopics
    };
  }, [exercises, progress]);

  const renderHome = () => {
    const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
    const progressPercent = stats.totalTopics > 0 ? Math.round((stats.completedTopics / stats.totalTopics) * 100) : 0;

    const daysMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const todayKey = daysMap[new Date().getDay()];
    const todaySchedule = schedule[todayKey];

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Home</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tempo de Estudo</p>
            <p className="text-3xl font-extrabold text-slate-800">{formatTime(stats.totalStudyTime)}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Desempenho</p>
                <p className="text-sm font-medium text-emerald-500">{stats.totalCorrect} Acertos</p>
                <p className="text-sm font-medium text-rose-500">{stats.totalErrors} Erros</p>
              </div>
              <p className="text-4xl font-extrabold text-slate-800">{accuracy}%</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Progresso no Edital</p>
                <p className="text-sm font-medium text-teal-600">{stats.completedTopics} Tópicos Concluídos</p>
                <p className="text-sm font-medium text-slate-400">{stats.totalTopics - stats.completedTopics} Pendentes</p>
              </div>
              <p className="text-4xl font-extrabold text-slate-800">{progressPercent}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-teal-500 border-y border-r border-y-slate-200 border-r-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-teal-500" />
              O Que Estudar Hoje? ({todaySchedule.title})
            </h3>
            <button onClick={() => setActiveTab('cronograma')} className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </button>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px] whitespace-pre-wrap text-sm text-slate-700 font-medium">
            {todaySchedule.content ? todaySchedule.content : (
              <span className="text-slate-400 italic font-normal">Nenhum estudo planejado para hoje. Vá até a aba "Planejamento" para organizar seu dia!</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Painel de Disciplinas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Disciplinas</th>
                  <th className="px-6 py-4 font-semibold text-center">Tempo</th>
                  <th className="px-4 py-4 font-semibold text-center"><Check className="w-4 h-4 mx-auto text-emerald-500" /></th>
                  <th className="px-4 py-4 font-semibold text-center"><X className="w-4 h-4 mx-auto text-rose-500" /></th>
                  <th className="px-4 py-4 font-semibold text-center"><Edit3 className="w-4 h-4 mx-auto text-slate-500" /></th>
                  <th className="px-6 py-4 font-semibold text-center">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(stats.disciplineStats).map(disc => {
                  const acc = disc.total > 0 ? Math.round((disc.correct / disc.total) * 100) : 0;
                  return (
                    <tr key={disc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-teal-600">{disc.title.replace(/^\d+\.\s*/, '')}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{formatTime(disc.time)}</td>
                      <td className="px-4 py-4 text-center font-medium text-emerald-500">{disc.correct}</td>
                      <td className="px-4 py-4 text-center font-medium text-rose-500">{disc.errors}</td>
                      <td className="px-4 py-4 text-center font-medium text-slate-600">{disc.total}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${acc >= 70 ? 'bg-emerald-100 text-emerald-700' : acc >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                          {disc.total > 0 ? `${acc}%` : '-'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderEdital = () => {
    const progressPercent = stats.totalTopics > 0 ? Math.round((stats.completedTopics / stats.totalTopics) * 100) : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full">
            <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
              <span>PROGRESSO NO EDITAL</span>
              <span className="text-slate-800 font-bold text-lg">{progressPercent}%</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{stats.completedTopics} de {stats.totalTopics} tópicos concluídos</p>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {EDITAL_DATA.map((subject) => {
            const isExpanded = expandedSubjects[subject.id];
            return (
              <div key={subject.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedSubjects(prev => ({ ...prev, [subject.id]: !prev[subject.id] }))}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-teal-400 rounded-full"></div>
                    <h3 className="font-bold text-slate-700 text-lg text-left">{subject.title.replace(/^\d+\.\s*/, '')}</h3>
                  </div>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-slate-400 bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-3 font-semibold w-full">Tópicos</th>
                          <th className="px-3 py-3 font-semibold text-center" title="Acertos"><Check className="w-4 h-4 mx-auto text-emerald-400" /></th>
                          <th className="px-3 py-3 font-semibold text-center" title="Erros"><X className="w-4 h-4 mx-auto text-rose-400" /></th>
                          <th className="px-3 py-3 font-semibold text-center" title="Total"><Edit3 className="w-4 h-4 mx-auto text-slate-400" /></th>
                          <th className="px-4 py-3 font-semibold text-center">%</th>
                          <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Último Estudo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {subject.topics.map((topic, index) => {
                          const key = `${subject.id}_${topic}`;
                          const isChecked = progress[key] || false;
                          const tStats = stats.topicStats[key] || { correct: 0, errors: 0, total: 0, lastDate: null };
                          const acc = tStats.total > 0 ? Math.round((tStats.correct / tStats.total) * 100) : 0;

                          return (
                            <tr key={index} className={`hover:bg-teal-50/30 transition-colors ${isChecked ? 'bg-teal-50/10' : ''}`}>
                              <td className="px-6 py-3">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleTopic(subject.id, topic)}
                                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-teal-500 checked:bg-teal-500 checked:border-teal-500 transition-all cursor-pointer"
                                    />
                                    <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                  </div>
                                  <span className={`text-slate-600 font-medium group-hover:text-teal-700 transition-colors leading-snug ${isChecked ? 'text-slate-400' : ''}`}>
                                    {index + 1}. {topic}
                                  </span>
                                </label>
                              </td>
                              <td className="px-3 py-3 text-center font-semibold text-emerald-500">{tStats.correct > 0 ? tStats.correct : '-'}</td>
                              <td className="px-3 py-3 text-center font-semibold text-rose-500">{tStats.errors > 0 ? tStats.errors : '-'}</td>
                              <td className="px-3 py-3 text-center font-semibold text-slate-500">{tStats.total > 0 ? tStats.total : '-'}</td>
                              <td className="px-4 py-3 text-center">
                                {tStats.total > 0 ? (
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${acc >= 70 ? 'bg-emerald-100 text-emerald-700' : acc >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {acc}%
                                  </span>
                                ) : <span className="text-slate-300">-</span>}
                              </td>
                              <td className="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">
                                {tStats.lastDate ? new Date(tStats.lastDate).toLocaleDateString('pt-BR') : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSchedule = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Planejamento Semanal</h2>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 hidden sm:block">Visão Geral</span>
          <button
            onClick={handleSaveScheduleBtn}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
              isScheduleSaved
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-teal-500/30 active:scale-95'
            }`}
          >
            {isScheduleSaved ? <><CheckCircle className="w-4 h-4" /> Salvo no Painel!</> : <><Check className="w-4 h-4" /> Salvar Cronograma</>}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex gap-4 min-w-[800px]">
          {Object.entries(schedule).map(([day, data], index) => {
            const isToday = new Date().getDay() === index; // 0 is Sunday
            return (
              <div key={day} className="flex-1 flex flex-col">
                <div className={`text-center py-2 mb-2 rounded-t-xl text-sm font-bold border-b-2 ${isToday ? 'bg-teal-500 text-white border-teal-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {data.title}
                </div>
                <textarea
                  className="w-full flex-1 min-h-[300px] p-3 bg-white border border-slate-200 rounded-b-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none text-sm text-slate-600 hover:bg-slate-50 transition-colors shadow-inner"
                  placeholder="Ex: Informática 1h..."
                  value={data.content}
                  onChange={(e) => handleScheduleChange(day, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 hidden sm:block">Registro de Estudo</h2>

      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 max-w-3xl mx-auto overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleAddExercise} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
                <select
                  className="w-full p-3 bg-slate-50 border-b-2 border-slate-200 focus:border-[#00BFA6] outline-none text-slate-700 font-medium transition-colors rounded-t-lg"
                  value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                >
                  <option value="Teoria">Teoria</option>
                  <option value="Revisão">Revisão</option>
                  <option value="Questões">Questões (Simulado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Disciplina</label>
                <select
                  className="w-full p-3 bg-slate-50 border-b-2 border-slate-200 focus:border-[#00BFA6] outline-none text-slate-700 font-medium transition-colors rounded-t-lg"
                  value={formSubject} onChange={(e) => { setFormSubject(e.target.value); setFormTopic(''); }} required
                >
                  <option value="">Selecione...</option>
                  {EDITAL_DATA.map(s => <option key={s.id} value={s.id}>{s.title.replace(/^\d+\.\s*/, '')}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tópico</label>
                <select
                  className="w-full p-3 bg-slate-50 border-b-2 border-slate-200 focus:border-[#00BFA6] outline-none text-slate-700 font-medium transition-colors rounded-t-lg disabled:opacity-50"
                  value={formTopic} onChange={(e) => setFormTopic(e.target.value)} required disabled={!formSubject}
                >
                  <option value="">Selecione o assunto...</option>
                  {formSubject && EDITAL_DATA.find(s => s.id === formSubject)?.topics.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tempo de Estudo (Minutos)</label>
                <input
                  type="number" min="0" placeholder="Ex: 60" inputMode="numeric"
                  className="w-full p-3 bg-slate-50 border-b-2 border-slate-200 focus:border-[#00BFA6] outline-none text-slate-700 font-medium transition-colors rounded-t-lg"
                  value={formTime} onChange={(e) => setFormTime(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Qtd. Questões</label>
                  <input
                    type="number" min="0" placeholder="Total" inputMode="numeric"
                    className="w-full p-3 bg-slate-50 border-b-2 border-slate-200 focus:border-[#00BFA6] outline-none text-slate-700 font-medium transition-colors rounded-t-lg"
                    value={formTotal} onChange={(e) => setFormTotal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Qtd. Erros</label>
                  <input
                    type="number" min="0" max={formTotal || 999} placeholder="Erros" inputMode="numeric"
                    className="w-full p-3 bg-rose-50/50 border-b-2 border-rose-200 focus:border-rose-500 outline-none text-rose-700 font-medium transition-colors rounded-t-lg"
                    value={formErrors} onChange={(e) => setFormErrors(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-[#00BFA6] text-white font-bold px-8 py-3 rounded-full hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/30 transition-all active:scale-95 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Registrar Estudo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Últimos Registros</h3>
        <div className="space-y-3">
          {exercises.slice(0, 10).map(ex => (
            <div key={ex.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700 uppercase">{ex.category}</span>
                  <span className="text-xs font-semibold text-slate-500 truncate">{EDITAL_DATA.find(s => s.id === ex.subjectId)?.title.replace(/^\d+\.\s*/, '')}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">{ex.topic}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium flex-wrap">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(ex.time)}</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {ex.correct} Acertos</span>
                  <span className="flex items-center gap-1"><X className="w-3.5 h-3.5 text-rose-500" /> {ex.errors} Erros</span>
                </div>
              </div>
              <button onClick={() => deleteExercise(ex.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {exercises.length === 0 && <p className="text-center text-slate-400 py-4">Nenhum estudo registrado.</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen glass-container text-slate-800 font-sans flex overflow-hidden">
      {/* Overlay escuro quando a sidebar está aberta */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 glass-sidebar text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/20">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors mr-2 focus:outline-none"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-[#00BFA6] rounded-lg flex items-center justify-center font-bold text-xl">
              e
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">estudei</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'cronograma', icon: CalendarDays, label: 'Planejamento' },
            { id: 'edital', icon: BookMarked, label: 'Edital' },
            { id: 'exercicios', icon: PenTool, label: 'Registrar' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                activeTab === item.id
                  ? 'bg-black/15 text-white shadow-inner'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        <header className="h-16 glass-header flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 box-content">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 capitalize">
              {activeTab === 'exercicios'
                ? 'Registro de Estudo'
                : activeTab === 'cronograma'
                ? 'Planejamento'
                : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-full shadow-sm border border-slate-200">
              <input
                type="file"
                id="import-file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImport}
              />
              <label
                htmlFor="import-file"
                className="p-1.5 text-slate-400 hover:text-[#00BFA6] hover:bg-teal-50 rounded-full cursor-pointer transition-colors"
                title="Importar Backup"
              >
                <Upload className="w-4 h-4" />
              </label>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button
                onClick={handleExport}
                className="p-1.5 text-slate-400 hover:text-[#00BFA6] hover:bg-teal-50 rounded-full transition-colors"
                title="Exportar Backup"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

            <Bell className="w-5 h-5 text-slate-400 hover:text-[#00BFA6] cursor-pointer hidden sm:block transition-colors" />
            <Moon className="w-5 h-5 text-slate-400 hover:text-[#00BFA6] cursor-pointer hidden sm:block transition-colors" />
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-md overflow-hidden">
              <User className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'cronograma' && renderSchedule()}
            {activeTab === 'edital' && renderEdital()}
            {activeTab === 'exercicios' && renderExercises()}
          </div>
        </main>
      </div>
    </div>
  );
}
