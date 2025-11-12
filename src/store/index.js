import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot 
} from 'firebase/firestore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tareas: []
  },
  getters: {
    todasLasTareas: state => state.tareas
  },
  mutations: {
    SET_TAREAS(state, tareas) {
      state.tareas = tareas
    },
    ADD_TAREA(state, tarea) {
      state.tareas.push(tarea)
    },
    UPDATE_TAREA(state, tareaActualizada) {
      const index = state.tareas.findIndex(t => t.id === tareaActualizada.id)
      if (index !== -1) {
        Vue.set(state.tareas, index, tareaActualizada)
      }
    },
    DELETE_TAREA(state, id) {
      state.tareas = state.tareas.filter(t => t.id !== id)
    }
  },
  actions: {
    // Escuchar cambios en tiempo real
    async inicializarTareas({ commit }) {
      const tareasCollection = collection(db, 'tareas')
      
      // Listener en tiempo real
      onSnapshot(tareasCollection, (snapshot) => {
        const tareas = []
        snapshot.forEach((doc) => {
          tareas.push({
            id: doc.id,
            ...doc.data()
          })
        })
        commit('SET_TAREAS', tareas)
      })
    },

    // Agregar nueva tarea
    async agregarTarea({ commit }, tarea) {
      try {
        const tareasCollection = collection(db, 'tareas')
        const docRef = await addDoc(tareasCollection, {
          titulo: tarea.titulo,
          hecho: tarea.hecho,
          editando: false,
          createdAt: new Date()
        })
        
        // El listener onSnapshot actualizará automáticamente el estado
        return docRef.id
      } catch (error) {
        console.error('Error al agregar tarea:', error)
        throw error
      }
    },

    // Actualizar tarea
    async actualizarTarea({ commit }, tarea) {
      try {
        const tareaRef = doc(db, 'tareas', tarea.id)
        await updateDoc(tareaRef, {
          titulo: tarea.titulo,
          hecho: tarea.hecho,
          editando: tarea.editando
        })
        
        // El listener onSnapshot actualizará automáticamente el estado
      } catch (error) {
        console.error('Error al actualizar tarea:', error)
        throw error
      }
    },

    // Eliminar tarea
    async eliminarTarea({ commit }, id) {
      try {
        const tareaRef = doc(db, 'tareas', id)
        await deleteDoc(tareaRef)
        
        // El listener onSnapshot actualizará automáticamente el estado
      } catch (error) {
        console.error('Error al eliminar tarea:', error)
        throw error
      }
    }
  },
  modules: {
  }
})