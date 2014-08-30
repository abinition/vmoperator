extends layout

block content

  .container
     p(style="background-color:blue; color:white; margin-bottom: 0 !important; ;") 
       | &nbsp; BOS CORONA / EMERALD / VANGUARD <SUPER USER> <CEV.INI>
  .container
     p(style="background-color:white; color:blue; margin-bottom: 0 !important; ;") 
       | &nbsp; System
       | &nbsp; Recipe   
       | &nbsp; Parameter  
       | &nbsp; Constants  
       | &nbsp; Print/Plot
       | &nbsp; Logging  
       | &nbsp; Service  
       | &nbsp; Help
     
  .container(ng-controller='GemController')
    .row
      .col-md-6
        .panel.panel-default
          .panel-heading
            | Supplies
          .panel-body
            form.form-horizontal(role="form")
              .form-group
                label.col-sm-2.control-label Recipe
                .col-sm-10
                  input#inputRecipe.form-control(type="text",placeholder="Recipe",style='font-size:14pt;')               
              .form-group
                .col-sm-offset-2.col-sm-10
                  .radio
                    label LLA
                      input#lla(type="radio",name="optionsRadios",value="A",checked)
                  .radio
                    label LLB
                      input#llb(type="radio",name="optionsRadios",value="B")

               .form-group
                 .col-sm-offset-2.col-sm-10
                   button.btn.btn-default(type="submit") Start
      .col-md-6
        .panel.panel-default
          .panel-heading
           | Process 
          .panel-body
            p Current Step number:  {{ Step }}
            p Maximum Step Time: {{ Time }} seconds
            p Chamber Pressure: {{ Pressure }} mTorr
            p RF: {{ RF }} Volt              
     .row
      .col-md-8
        .panel.panel-default
          .panel-heading
            | Process Drive
          .panel-body
            p Name: {{ Name }}
            p Helium pressure: {{ Helium }} Torr
            p ESC Chucking Voltage: {{ Voltage }} V
            p Expected Cathode Temp: {{ Temp }} C
      .col-md-4
        .panel.panel-default
          .panel-heading
            | Picture
          .panel-body
            p Lotid: {{ Lotid }}
            p Stage: {{ Stage }} 
            p PPID: {{ PPID }}
            p LoadLock: {{ LoadLock }}

  //.container
  //  .ng-view
    
block scripts
  script(src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.js')
  script(src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular-route.js')
  script(src='//code.jquery.com/jquery.js')
  script(src='//code.jquery.com/ui/1.10.3/jquery-ui.js')
  script(src='js/bootstrap.min.js')
  script(src='js/app.js')
  script(src='js/controllers.js')
  //script(src='js/services.js')
  //script(src='js/filters.js')
  //script(src='js/directives.js')

