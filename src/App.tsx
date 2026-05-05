import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Home } from "./components/Home";
import { Header } from "./components/Header";
import { Breadcrumb } from "./components/Breadcrumb";
import { QuestionScreen } from "./components/QuestionScreen";
import { ModulationScreen } from "./components/ModulationScreen";
import { RecommendationScreen } from "./components/RecommendationScreen";
import { EVAScreen } from "./components/EVAScreen";
import { RedFlagsScreen } from "./components/RedFlagsScreen";
import { StatsScreen } from "./components/StatsScreen";
import { Onboarding } from "./components/Onboarding";
import { SessionInputsScreen } from "./components/SessionInputsScreen";
import { PainTypeScreener } from "./components/PainTypeScreener";
import { scorePainAssessment } from "./types/painType";
import type { PainAssessment } from "./types/painType";
import { BodyMapScreen } from "./components/BodyMapScreen";
import { RegionTriageScreen } from "./components/RegionTriageScreen";
import { DeepAssessmentScreen } from "./components/DeepAssessmentScreen";
import { moduleForZone, hasDeepModule } from "./data/deepAssessment";
import type { DeepAssessmentAnswers } from "./types/deepAssessment";
import { triageZonesForRegions } from "./types/bodyMap";
import type { TriageStatus, TriageZone } from "./types/triage";
import { YellowFlagsScreener } from "./components/YellowFlagsScreener";
import { scoreYellowFlags } from "./types/yellowFlags";
import type { YellowFlagAssessment } from "./types/yellowFlags";
import { treesById } from "./data/trees";
import { hasSeenOnboarding, markOnboardingSeen } from "./lib/onboarding";
import { buildRecap } from "./lib/recap";
import { loadState, saveState, clearState } from "./lib/persistence";
import {
  loadPatientContext,
  savePatientContext,
  clearPatientContext,
} from "./lib/patientContext";
import {
  loadHistory,
  appendHistory,
  updateLatestEntry,
  clearHistory,
  type HistoryEntry,
} from "./lib/history";
import type { PatientContext } from "./types/patient";
import { evaThresholdFor, evaThresholdNote } from "./types/patient";
import type { SessionInputs, PostSessionLoad } from "./types/session";
import { loadAU } from "./types/session";

type TreeState = {
  treeId: string;
  history: string[];
  evaValues: Record<string, number>;
  sessionInputs: SessionInputs;
};

type Mode =
  | "home"
  | "tree"
  | "treeInputs"
  | "redFlags"
  | "stats"
  | "painType"
  | "bodyMap"
  | "triage"
  | "deepAssessment"
  | "yellowFlags";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [state, setState] = useState<TreeState | null>(null);
  const [resumeAvailable, setResumeAvailable] = useState<TreeState | null>(null);
  const [patientContext, setPatientContext] = useState<PatientContext>({});
  const [history, setHistoryState] = useState<HistoryEntry[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [triageZones, setTriageZones] = useState<TriageZone[]>([]);
  const [deepAssessmentZone, setDeepAssessmentZone] = useState<TriageZone | null>(null);
  const initialLoad = useRef(true);
  const recordedRecoIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const persisted = loadState();
    if (
      persisted &&
      treesById[persisted.treeId] &&
      persisted.history.length > 0
    ) {
      setResumeAvailable({
        treeId: persisted.treeId,
        history: persisted.history,
        evaValues: persisted.evaValues ?? {},
        sessionInputs: persisted.sessionInputs ?? {},
      });
    }
    const ctx = loadPatientContext();
    if (ctx) setPatientContext(ctx);
    setHistoryState(loadHistory());
    if (!hasSeenOnboarding()) setShowOnboarding(true);
    initialLoad.current = false;
  }, []);

  const handleCloseOnboarding = useCallback(() => {
    markOnboardingSeen();
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    if (initialLoad.current) return;
    if (state) saveState(state);
  }, [state]);

  const tree = state ? treesById[state.treeId] : null;
  const currentNodeId = state ? state.history[state.history.length - 1] : null;
  const currentNode = tree && currentNodeId ? tree.nodes[currentNodeId] : null;

  // Append to history when reaching a recommendation
  useEffect(() => {
    if (!state || !tree || !currentNode) return;
    if (currentNode.kind !== "recommendation") return;
    const recoKey = `${state.treeId}:${currentNode.id}:${state.history.join("-")}`;
    if (recordedRecoIds.current.has(recoKey)) return;
    recordedRecoIds.current.add(recoKey);

    const evaPeak = Object.values(state.evaValues).length
      ? Math.max(...Object.values(state.evaValues))
      : undefined;

    const entry: HistoryEntry = {
      id: recoKey,
      date: new Date().toISOString(),
      treeId: state.treeId,
      treeTitle: tree.title,
      recommendationId: currentNode.id,
      recommendationTitle: currentNode.title,
      severity: currentNode.severity,
      evaPeak,
      patientInitials: patientContext.initials,
      patientLocation: patientContext.location,
      patientChronicity: patientContext.chronicity,
    };
    setHistoryState(appendHistory(entry));
  }, [state, tree, currentNode, patientContext]);

  const handleSelectTree = useCallback((treeId: string) => {
    const t = treesById[treeId];
    if (!t) return;
    setState({
      treeId,
      history: [t.startId],
      evaValues: {},
      sessionInputs: {},
    });
    setResumeAvailable(null);
    setMode(t.inputsSchema ? "treeInputs" : "tree");
  }, []);

  const handleInputsContinue = useCallback((inputs: SessionInputs) => {
    setState((prev) => (prev ? { ...prev, sessionInputs: inputs } : prev));
    setMode("tree");
  }, []);

  const handleInputsSkip = useCallback(() => {
    setMode("tree");
  }, []);

  const handleOpenRedFlags = useCallback(() => setMode("redFlags"), []);
  const handleCloseRedFlags = useCallback(() => setMode("home"), []);
  const handleOpenStats = useCallback(() => setMode("stats"), []);
  const handleOpenPainType = useCallback(() => setMode("painType"), []);
  const handleOpenBodyMap = useCallback(() => setMode("bodyMap"), []);
  const handleOpenYellowFlags = useCallback(() => setMode("yellowFlags"), []);

  const handleSaveYellowFlags = useCallback(
    (assessment: YellowFlagAssessment) => {
      const score = scoreYellowFlags(assessment.answers);
      const next: PatientContext = {
        ...patientContext,
        yellowFlags: assessment,
        yellowFlagScore: score,
      };
      setPatientContext(next);
      savePatientContext(next);
    },
    [patientContext],
  );

  const handleSaveBodyZones = useCallback(
    (zones: string[]) => {
      const next: PatientContext = {
        ...patientContext,
        bodyZones: zones.length > 0 ? zones : undefined,
      };
      setPatientContext(next);
      savePatientContext(next);
      setMode("home");
    },
    [patientContext],
  );

  const handleSaveBodyZonesAndTriage = useCallback(
    (zones: string[]) => {
      const tz = triageZonesForRegions(zones);
      const next: PatientContext = {
        ...patientContext,
        bodyZones: zones.length > 0 ? zones : undefined,
      };
      setPatientContext(next);
      savePatientContext(next);
      setTriageZones(tz);
      setMode("triage");
    },
    [patientContext],
  );

  const handleTriageComplete = useCallback(
    (status: TriageStatus) => {
      const next: PatientContext = {
        ...patientContext,
        triageStatus: status,
      };
      setPatientContext(next);
      savePatientContext(next);
    },
    [patientContext],
  );

  const handleClearTriage = useCallback(() => {
    const next: PatientContext = {
      ...patientContext,
      triageStatus: undefined,
    };
    setPatientContext(next);
    savePatientContext(next);
  }, [patientContext]);

  const handleOpenDeepAssessment = useCallback((zone: TriageZone) => {
    if (!hasDeepModule(zone)) return;
    setDeepAssessmentZone(zone);
    setMode("deepAssessment");
  }, []);

  const handleDeepAssessmentComplete = useCallback(
    (_answers: DeepAssessmentAnswers) => {
      // Today the answers are kept inside the screen (results computed live).
      // Hook reserved for future persistence (history of deep assessments).
    },
    [],
  );

  const handleAcknowledgeRedFlags = useCallback(() => {
    const status: TriageStatus = {
      date: new Date().toISOString(),
      zones: [],
      outcome: "clear",
      flaggedIds: [],
      hasCritical: false,
    };
    const next: PatientContext = {
      ...patientContext,
      triageStatus: status,
    };
    setPatientContext(next);
    savePatientContext(next);
  }, [patientContext]);

  const handleSavePainAssessment = useCallback(
    (assessment: PainAssessment) => {
      const score = scorePainAssessment(assessment.answers);
      const next: PatientContext = {
        ...patientContext,
        painAssessment: assessment,
        painScore: score,
      };
      setPatientContext(next);
      savePatientContext(next);
    },
    [patientContext],
  );

  const handleResume = useCallback(() => {
    if (!resumeAvailable) return;
    setState(resumeAvailable);
    setResumeAvailable(null);
    setMode("tree");
  }, [resumeAvailable]);

  const handleDismissResume = useCallback(() => {
    setResumeAvailable(null);
    clearState();
  }, []);

  const handleAnswer = useCallback((nextId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, history: [...prev.history, nextId] };
    });
  }, []);

  const handleEVAConfirm = useCallback((value: number, nextId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const currentId = prev.history[prev.history.length - 1];
      return {
        ...prev,
        history: [...prev.history, nextId],
        evaValues: { ...prev.evaValues, [currentId]: value },
      };
    });
  }, []);

  const handleBack = useCallback(() => {
    if (mode === "treeInputs") {
      clearState();
      setState(null);
      setMode("home");
      return;
    }
    if (mode !== "tree") {
      setMode("home");
      return;
    }
    setState((prev) => {
      if (!prev) return prev;
      if (prev.history.length <= 1) {
        // If the tree has inputs, going back from q1 returns to inputs screen
        const t = treesById[prev.treeId];
        if (t?.inputsSchema) {
          setMode("treeInputs");
          return prev;
        }
        clearState();
        setMode("home");
        return null;
      }
      return { ...prev, history: prev.history.slice(0, -1) };
    });
  }, [mode]);

  const handleHome = useCallback(() => {
    clearState();
    setState(null);
    setMode("home");
  }, []);

  const handleEditStep = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return prev;
      // Truncate history to keep up to and including the step at `index`
      // (history index = recap entry index, since recap[i] corresponds to history[i])
      const newHistory = prev.history.slice(0, index + 1);
      // Drop EVA values that are no longer on the path
      const validIds = new Set(newHistory);
      const newEvaValues: Record<string, number> = {};
      for (const [k, v] of Object.entries(prev.evaValues)) {
        if (validIds.has(k)) newEvaValues[k] = v;
      }
      return { ...prev, history: newHistory, evaValues: newEvaValues };
    });
    // Reset reco-recorded ids so a fresh path can be re-recorded
    recordedRecoIds.current = new Set();
  }, []);

  const handleRestart = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const t = treesById[prev.treeId];
      return {
        treeId: prev.treeId,
        history: [t.startId],
        evaValues: {},
        // Keep the session inputs — same patient, same session
        sessionInputs: prev.sessionInputs,
      };
    });
    recordedRecoIds.current = new Set();
  }, []);

  const handlePatientContextChange = useCallback((ctx: PatientContext) => {
    setPatientContext(ctx);
    savePatientContext(ctx);
  }, []);

  const handlePatientContextClear = useCallback(() => {
    setPatientContext({});
    clearPatientContext();
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistoryState([]);
  }, []);

  const handlePostSessionChange = useCallback(
    (load: PostSessionLoad) => {
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sessionInputs: { ...prev.sessionInputs, postSession: load },
        };
      });
      // If we're on a recommendation node, push the sRPE into the recorded history entry
      if (state && tree && currentNode?.kind === "recommendation") {
        const computedAU =
          load.srpe !== undefined && load.actualDuration !== undefined
            ? loadAU(load.srpe, load.actualDuration)
            : undefined;
        const newHistory = updateLatestEntry(
          { treeId: state.treeId, recommendationId: currentNode.id },
          {
            srpe: load.srpe,
            durationMin: load.actualDuration,
            loadAU: computedAU,
          },
        );
        setHistoryState(newHistory);
      }
    },
    [state, tree, currentNode],
  );

  const headerTitle =
    mode === "redFlags"
      ? "Drapeaux rouges"
      : mode === "stats"
        ? "Statistiques"
        : mode === "painType"
          ? "Profil de douleur"
          : mode === "bodyMap"
            ? "Triage · localisation"
            : mode === "triage"
              ? "Triage · drapeaux rouges"
              : mode === "deepAssessment"
                ? "Évaluation approfondie"
              : mode === "yellowFlags"
                ? "Drapeaux jaunes"
                : mode === "treeInputs"
                  ? `${tree?.shortTitle ?? ""} · détails`
                  : tree?.shortTitle;

  const headerProps = useMemo(
    () => ({
      treeTitle: headerTitle,
      canGoBack: mode !== "home",
      onBack: handleBack,
      onHome: handleHome,
    }),
    [headerTitle, mode, handleBack, handleHome],
  );

  const recap = useMemo(() => {
    if (!state || !tree) return [];
    return buildRecap(tree, state.history, state.evaValues);
  }, [state, tree]);

  return (
    <div className="stars-bg relative min-h-screen">
      {showOnboarding && <Onboarding onClose={handleCloseOnboarding} />}

      <Header {...headerProps} />

      {mode === "tree" &&
        state &&
        tree &&
        currentNode &&
        currentNode.kind !== "recommendation" && (
          <Breadcrumb tree={tree} history={state.history} />
        )}

      {mode === "treeInputs" && state && tree && tree.inputsSchema && (
        <main>
          <SessionInputsScreen
            schema={tree.inputsSchema}
            treeTitle={tree.title}
            initial={state.sessionInputs}
            onContinue={handleInputsContinue}
            onSkip={handleInputsSkip}
          />
        </main>
      )}

      {mode !== "treeInputs" && (
      <main>
        <AnimatePresence mode="wait">
          {mode === "redFlags" ? (
            <RedFlagsScreen key="redFlags" onBackHome={handleCloseRedFlags} />
          ) : mode === "bodyMap" ? (
            <BodyMapScreen
              key="bodyMap"
              initial={patientContext.bodyZones}
              onSave={handleSaveBodyZones}
              onSaveAndTriage={handleSaveBodyZonesAndTriage}
              onCancel={() => setMode("home")}
            />
          ) : mode === "triage" ? (
            <RegionTriageScreen
              key="triage"
              zones={triageZones}
              initialFlagged={patientContext.triageStatus?.flaggedIds}
              onComplete={handleTriageComplete}
              onBackHome={() => setMode("home")}
              onStartDeepAssessment={handleOpenDeepAssessment}
            />
          ) : mode === "deepAssessment" && deepAssessmentZone ? (
            (() => {
              const mod = moduleForZone(deepAssessmentZone);
              if (!mod) {
                setMode("home");
                return null;
              }
              return (
                <DeepAssessmentScreen
                  key={`deep-${deepAssessmentZone}`}
                  module={mod}
                  onComplete={handleDeepAssessmentComplete}
                  onExit={() => setMode("home")}
                />
              );
            })()
          ) : mode === "yellowFlags" ? (
            <YellowFlagsScreener
              key="yellowFlags"
              initial={patientContext.yellowFlags}
              onSave={handleSaveYellowFlags}
              onBackHome={() => setMode("home")}
            />
          ) : mode === "painType" ? (
            <PainTypeScreener
              key="painType"
              initial={patientContext.painAssessment}
              onSave={handleSavePainAssessment}
              onBackHome={() => setMode("home")}
            />
          ) : mode === "stats" ? (
            <StatsScreen
              key="stats"
              history={history}
              onClear={handleClearHistory}
            />
          ) : mode === "home" || !state || !tree || !currentNode ? (
            <Home
              key="home"
              onSelectTree={handleSelectTree}
              onOpenRedFlags={handleOpenRedFlags}
              onOpenPainType={handleOpenPainType}
              onOpenBodyMap={handleOpenBodyMap}
              onOpenYellowFlags={handleOpenYellowFlags}
              onOpenStats={handleOpenStats}
              onAcknowledgeRedFlags={handleAcknowledgeRedFlags}
              onClearTriage={handleClearTriage}
              onOpenDeepAssessment={handleOpenDeepAssessment}
              evaluationCount={history.length}
              patientContext={patientContext}
              onPatientContextChange={handlePatientContextChange}
              onPatientContextClear={handlePatientContextClear}
              resume={(() => {
                if (!resumeAvailable) return null;
                const t = treesById[resumeAvailable.treeId];
                if (!t) return null;
                const last =
                  resumeAvailable.history[resumeAvailable.history.length - 1];
                const isTerminal = t.nodes[last]?.kind === "recommendation";
                return {
                  treeTitle: t.title,
                  stepsDone: resumeAvailable.history.length,
                  isTerminal,
                  onResume: handleResume,
                  onDismiss: handleDismissResume,
                };
              })()}
            />
          ) : currentNode.kind === "question" ? (
            <QuestionScreen
              key={currentNode.id}
              node={currentNode}
              onAnswer={handleAnswer}
            />
          ) : currentNode.kind === "eva" ? (
            <EVAScreen
              key={currentNode.id}
              node={currentNode}
              initialValue={state.evaValues[currentNode.id]}
              thresholdOverride={evaThresholdFor(patientContext.chronicity)}
              thresholdNote={evaThresholdNote(patientContext.chronicity)}
              onConfirm={handleEVAConfirm}
            />
          ) : currentNode.kind === "modulation" ? (
            <ModulationScreen
              key={currentNode.id}
              node={currentNode}
              inputs={state.sessionInputs}
              onAnswer={handleAnswer}
            />
          ) : (
            <RecommendationScreen
              key={currentNode.id}
              tree={tree}
              node={currentNode}
              recap={recap}
              patientContext={patientContext}
              sessionInputs={state.sessionInputs}
              onRestart={handleRestart}
              onHome={handleHome}
              onEditStep={handleEditStep}
              onPostSessionChange={handlePostSessionChange}
            />
          )}
        </AnimatePresence>
      </main>
      )}
    </div>
  );
}
