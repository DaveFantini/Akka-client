<template>
  <v-app>
    <main>

      <div>
        <template>
          <v-tabs
            v-model="tab"
            color="blue"
            dark
            grow
          >
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab
            :key="Streaming">
              Streaming mode            
            </v-tab>

            <v-tab
            :key="Status">
              Status            
            </v-tab>

            <v-tab-item
              :key="Streaming">
              <v-container>
                <v-layout row>
                  <v-flex xs1>
                    <v-card></v-card>
                  </v-flex>
                  
                  <v-flex xs10>
                    <v-card>
                      <v-card-title>
                        <span class="font-weight-black px-2 pb-1">AKKA PROCESSING ENGINE</span><br>
                      </v-card-title>
                      <v-layout row>
                        
                        <v-flex  class="px-3" xs4>
                             <v-btn color="info" @click="openWS">Connect</v-btn>
                        </v-flex>

                        <v-flex   xs5>
                           <v-switch
                              v-model="switch1"
                              :label = "`${switchbox.toString()}`"
                              class="font-weight-black"                            >
                          </v-switch>
                          <div>
                            <v-alert
                              :value="connectedAlert"
                              dismissible
                              type="success"
                              icon="check_circle"
                              outline
                            >
                            Connected succesfully
                            </v-alert>
                            <v-alert
                              v-model="closedAlert"
                              dismissible
                              type="warning"
                            >
                              Connection closed
                            </v-alert>
                          </div>
                        </v-flex>
                      </v-layout>
                      <form class="px-4 pb-4">
                        <v-text-field
                          v-model="MessageID"
                          :error-messages="nameErrors"
                          label="Message ID"
                          required
                          
                        ></v-text-field>
                        <v-text-field
                          v-model="value"
                          :error-messages="emailErrors"
                          label="Message value"
                          required
                        ></v-text-field>
                        <v-btn  color="success" @click="sendMessage">submit</v-btn>
                        <v-btn  color="warning" @click="clear">clear</v-btn>
                          </form>
                      </v-card>
                    </v-flex>
                  
                  <v-flex xs1>
                    <v-card>
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs1>
                    <v-card></v-card>
                  </v-flex>

                  <v-flex xs10>
                   <v-card>   
                     <pre>{{ json_output | pretty}}</pre>
                     
                   </v-card>
                  </v-flex>

                  <v-flex xs1>
                    <v-card></v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>

            
          <v-tab-item
          :key="Status">
            <v-container>
              <v-layout row>
                <v-flex xs1>
                  <v-card></v-card>
                </v-flex>
                
                <v-flex xs10>
                  <v-card>
                    <v-card-title>
                      <span class="font-weight-black px-2 pb-1">STATUS</span><br>
                    </v-card-title>
                    
                    <form class="px-4 pb-4" ref="form">
                       <v-select
                        v-model="MessageIDstatus"
                        :items="processors"
                        :rules="[v => !!v || 'Item is required']"
                        label="Processor"
                        required
                      ></v-select>
                      
                       <v-radio-group v-model="radioGroup" required>
                        <v-radio
                          v-for="n in this.API_status"
                          :key="n.name"
                          :label="`${n.name}`"
                          :value="n.value"
                        ></v-radio>
                        
                      </v-radio-group>
            
                      <v-btn color="success" @click="getStatus">submit</v-btn>
                      <v-btn color="warning" @click="reset">reset</v-btn>
                    </form>
                  </v-card>
                </v-flex>
                <v-flex xs1>
                  <v-card></v-card>
                </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs1>
                    <v-card></v-card>
                  </v-flex>

                  <v-flex xs10>
                   <v-card>   
                     <pre>{{ status_output | pretty}}</pre>
                     
                   </v-card>
                  </v-flex>

                  <v-flex xs1>
                    <v-card></v-card>
                  </v-flex>
                </v-layout>
            </v-container>
          </v-tab-item>
          </v-tabs>
        </template>
      </div>
    </main>
  </v-app>
</template>

<script>
import axios from "axios"

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    processors:[
      "Map1",
      "Filter1",
      "Merge1",
      "Split1"
    ],
    API_status : [{name : "Global Status", value:""}, {name : "Failure", value:"/failures"},{name : "Lost", value:"/messageLost"}, {name : "Processed", value:"/messageProcessed"}],
    radioGroup : "Global Status",
    S_output: [],
    json_output : "{}",
    status_output: "{}",
    connectedAlert: false,
    switch1: "true", 

  }),

  methods:{
      concatStrings(s1, s2) {
        return s1.concat(s2);
      },

      sendMessage(){
        var strID = this.MessageID
        var mess = this.value
        const Url = "http://127.0.0.1:4567/engine/startStream"

        axios.post(Url,{key: strID, value: mess})
          .then(response => {
              //
          })
    
          
      },
      getStatus(){
        var processor = this.MessageIDstatus.toString()
        // default value of checkbox is undefined 
        // var failure = (this.Failurecheckbox == undefined) ? false : this.Failurecheckbox
        // var messLost = (this.Lostcheckbox == undefined) ? false : this.Lostcheckbox
        // var messProc = (this.Processedcheckbox == undefined) ? false : this.Processedcheckbox 
        var Url = "http://127.0.0.1:4567/engine/status/" + processor + this.radioGroup
      
        axios.get(Url)
        .then(response => {
          this.status_output = JSON.stringify(response.data)
        })
        .catch(function (error) {
        // handle error
        this.status_output = JSON.stringify("{e : error.response.data}")
        })
      },

      clear(){

      },
      submit(){

      },
      openWS(){
        this.$options.sockets.onmessage = (response) => {
          this.S_output.push(JSON.parse(response.data))
          this.json_output = JSON.stringify(this.S_output)

        }

        this.$options.sockets.onclose = () => {
          this.connectedAlert = false
          this.closedAlert = true
        }
        this.$connect()
          this.connectedAlert = true
        }
  },
   filters: {
    pretty: function(value) {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
    
  },
  computed :{
    switchbox : function(){
      if(this.switch1){
        return "Streaming"
      }else{
        return "Batch"
      }
    }
  },
  validate () {
      if (this.$refs.form.validate()) {
          this.snackbar = true
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      }
  }

</script>
