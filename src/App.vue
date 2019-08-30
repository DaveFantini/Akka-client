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
                        
                        <v-flex  class="px-4" xs3>
                           <v-radio-group v-model="radioGroupEngine" :mandatory="true" v-on:change="switchMode">
                            <v-radio
                              label="Streaming"
                              value= "Streaming"
                            ></v-radio>
                             <v-radio 
                              label="Batch"
                              value = "Batch"
                              class="pt-3"
                            ></v-radio>
                          </v-radio-group>
                        </v-flex>

                        <v-flex class="pt-2" xs2>
                          <v-btn v-if = "this.radioGroupEngine=== 'Batch'" color="info" @click="RequestBatch">Batch</v-btn>
                        </v-flex>
                        <v-flex xs3>
                             <v-text-field v-if = "this.radioGroupEngine=== 'Batch'"
                                v-model="BatchField"
                                label="Batch size"
                                outlined
                                :clearable = true
                        ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <form ref= "formMessage" class="px-4 pb-4">
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
                    
                    <form class="px-4 pb-4">
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
import { log } from 'util';
import { truncate } from 'fs';

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
    radioGroupEngine: "Batch",

  }),

  methods:{
      concatStrings(s1, s2) {
        return s1.concat(s2);
      },

      sendMessage(){
        var strID = this.MessageID
        var mess = this.value
        const Url = "http://127.0.0.1:4567/engine/message"

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
      RequestBatch(){
        var Url = "http://127.0.0.1:4567/engine/messages"
        axios.get(Url, {batchSize:parseInt(this.BatchField)})
        .then(response => {
          this.status_output = JSON.stringify(response.data)
        })
        
      },

      clear(){        
        this.$refs.formMessage.reset()
      },
      reset(){
        
        this.$refs.formStatus.reset()

      },
      submit(){

      },
      openWS(){
      
        this.$options.sockets.onmessage = (response) => {
          this.S_output.push(JSON.parse(response.data))
          this.json_output = JSON.stringify(this.S_output)

        }

        this.$options.sockets.onclose = () => {
          // this.connectedAlert = false
          // this.closedAlert = true
        }
        
        this.$connect()
        // this.connectedAlert = true
        },
      switchMode(){
        if(this.radioGroupEngine == "Streaming"){
        console.log("opening WS connection");
        this.openWS()
        return
      }else{
        console.log("closing WS connection");
        this.$disconnect()
        return
      }
      }
  },
   filters: {
    pretty: function(value) {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
    
  },
  
}
</script>
