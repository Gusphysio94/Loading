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
import type { SessionInputs, PostSessionLoad } from "./types/session";
import { loadAU } from "./types/session";

type TreeState = {
  treeId: string;
  history: string[];
  evaValues: Record<string, number>;
  sessionInputs: SessionInputs;
};

type Mode = "home" | "tree" | "treeInputs" | "redFlags" | "stats";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [state, setState] = useState<TreeState | null>(null);
  const [resumeAvailable, setResumeAvailable] = useState<TreeState | null>(null);
  const [patientContext, setPatientContext] = useState<PatientContext>({});
  const [history, setHistoryState] = useState<HistoryEntry[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
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
              onOpenStats={handleOpenStats}
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
