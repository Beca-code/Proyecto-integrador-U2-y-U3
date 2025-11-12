<template>
  <div class="home">
    <!--para nueva tarea-->
    <v-text-field
      v-model="nuevoTituloTarea"
      @click:append="agregarTarea"
      @keyup.enter="agregarTarea"
      class="pa-3"
      outlined
      label="Nueva tarea"
      append-icon="mdi-plus"
      hide-details
      clearable
    ></v-text-field>

    <!-- Lista de tareas -->
    <v-list flat>
      <div v-for="tarea in tareas" :key="tarea.id">
        <v-list-item 
          @click="toggleTarea(tarea)"
          :class="{ 'blue lighten-5': tarea.hecho }"
        >
          <template v-slot>
            <!--Checkbox-->
            <v-list-item-action>
              <v-checkbox 
                v-model="tarea.hecho" 
                color="primary"
                @click.stop
              ></v-checkbox>
            </v-list-item-action>

            <!--Contenido-->
            <v-list-item-content>
              <!--para editar tarea-->
              <v-text-field
                v-if="tarea.editando"
                v-model="tarea.titulo"
                dense
                hide-details
                solo
                autofocus
                @keyup.enter="guardarEdicion(tarea)"
                @click.stop
              ></v-text-field>

              <!--para tarea hecho-->
              <v-list-item-title
                v-else
                :class="{ 'text-decoration-line-through': tarea.hecho }"
              >
                {{ tarea.titulo }}
              </v-list-item-title>
            </v-list-item-content>

            <!--Botón Editar/Guardar-->
            <v-list-item-action>
              <v-btn icon @click.stop="editarOGuardar(tarea)">
                <v-icon :color="tarea.editando ? 'green' : 'blue lighten-1'">
                  {{ tarea.editando ? 'mdi-check' : 'mdi-pencil' }}
                </v-icon>
              </v-btn>
            </v-list-item-action>

            <!--Botón Borrar-->
            <v-list-item-action>
              <v-btn icon @click.stop="BorrarTarea(tarea.id)">
                <v-icon color="red lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      nuevoTituloTarea: ''
    }
  },
  computed: {
    ...mapGetters({
      tareas: 'todasLasTareas'
    })
  },
  created() {
    // Inicializar listener de Firebase al crear el componente
    this.$store.dispatch('inicializarTareas')
  },
  methods: {
    async agregarTarea() {
      if (!this.nuevoTituloTarea.trim()) return
      
      try {
        await this.$store.dispatch('agregarTarea', {
          titulo: this.nuevoTituloTarea,
          hecho: false
        })
        this.nuevoTituloTarea = ''
      } catch (error) {
        console.error('Error al agregar tarea:', error)
        alert('Error al agregar la tarea. Por favor, intenta de nuevo.')
      }
    },
    async editarOGuardar(tarea) {
      // Si está en modo edición, guardar
      if (tarea.editando) {
        await this.guardarEdicion(tarea)
      } else {
        // Si no, entrar en modo edición
        tarea.editando = true
        await this.$store.dispatch('actualizarTarea', tarea)
      }
    },
    async guardarEdicion(tarea) {
      try {
        tarea.editando = false
        await this.$store.dispatch('actualizarTarea', tarea)
      } catch (error) {
        console.error('Error al guardar edición:', error)
        alert('Error al guardar los cambios.')
      }
    },
    async toggleTarea(tarea) {
      // Solo cambiar el estado si no está en modo edición
      if (!tarea.editando) {
        try {
          tarea.hecho = !tarea.hecho
          await this.$store.dispatch('actualizarTarea', tarea)
        } catch (error) {
          console.error('Error al actualizar tarea:', error)
          tarea.hecho = !tarea.hecho // Revertir cambio
        }
      }
    },
    async BorrarTarea(id) {
      if (confirm('¿Estás seguro de borrar la tarea?')) {
        try {
          await this.$store.dispatch('eliminarTarea', id)
        } catch (error) {
          console.error('Error al borrar tarea:', error)
          alert('Error al borrar la tarea.')
        }
      }
    }
  }
}
</script>