import { create } from 'zustand'

export const useAcademicStore = create((set) => ({
  activeSession: null,
  sessions: [],
  classes: [],
  subjects: [],

  setSessions: (sessions) => {
    const active = sessions.find((s) => s.isActive) || sessions[0] || null
    set({ sessions, activeSession: active })
  },

  setClasses: (classes) => set({ classes }),

  setSubjects: (subjects) => set({ subjects }),

  setActiveSession: (session) => set({ activeSession: session }),
}))
