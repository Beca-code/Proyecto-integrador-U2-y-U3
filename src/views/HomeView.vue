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
export default {
  name: 'Home',
  data() {
    return {
      nuevoTituloTarea: '',
      tareas: []
    }
  },
  methods: {
    agregarTarea() {
      if (!this.nuevoTituloTarea.trim()) return
      const nTarea = {
        id: Date.now(),
        titulo: this.nuevoTituloTarea,
        hecho: false,
        editando: false
      }
      this.tareas.push(nTarea)
      this.nuevoTituloTarea = ''
    },
    editarOGuardar(tarea) {
      // Si está en modo edición, guardar
      if (tarea.editando) {
        this.guardarEdicion(tarea)
      } else {
        // Si no, entrar en modo edición
        tarea.editando = true
      }
    },
    guardarEdicion(tarea) {
      tarea.editando = false
    },
    toggleTarea(tarea) {
      // Solo cambiar el estado si no está en modo edición
      if (!tarea.editando) {
        tarea.hecho = !tarea.hecho
      }
    },
    BorrarTarea(id) {
      if (confirm('¿Estás seguro de borrar la tarea?')) {
        this.tareas = this.tareas.filter(t => t.id !== id)
      }
    }
  }
}
</script>