extends layout

block content
  .navbar.navbar-inverse(role='navigation')
    .navbar-inner
      button.navbar-toggle(type='button',data-toggle='collapse',data-target='.navbar-responsive-collapse')
        span.sr-only Toggle navigation
        span.icon-bar
        span.icon-bar
        span.icon-bar
      a.brand.navbar-brand(href='#',style='color: #fff;') VMO
      .navbar-text Tool Control System Simulator
    .collapse.navbar-collapse.navbar-responsive-collapse
      ul.nav.navbar-nav.navbar-right.navbar-inverse
       li
         a#ddm2(style='color: #fff;',href='javascript:history.go(0)')
           span.glyphicon.glyphicon-refresh.white
       li
         a#ddm3(style='color: #fff;',data-toggle='dropdown',data-target='#',href='#')
           span.glyphicon.glyphicon-list.white  
         ul.dropdown-menu(role='menu',aria-labelledby='ddm3')
           li(role='presentation')
             a(role='menuitem',tabindex='-1',href='#') Login
           li.divider(role='presentation')
           li(role='presentation')
             a(role='menuitem',tabindex='-1',href='#') Monitor
       li
         img(style='margin-top: 15px;',src='img/abinition.png',height='20px',alt='Abinition',href='#')

  .container(ng-controller='GemController')
    .row
      .col-md-6
        .panel.panel-default
          .panel-heading
            | {{ ToolName }} Control
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
                  //.checkbox
                  //  label Engineering Mode
                  //    input(type='checkbox') 
               .form-group
                 .col-sm-offset-2.col-sm-10
                   button.btn.btn-default(type="submit") Start
      .col-md-6
        .panel.panel-default
          .panel-heading
           | Sensors
          .panel-body
            p Current Step number:  {{ Step }}
            p Maximum Step Time: {{ Time }} seconds
            p Chamber Pressure: {{ Pressure }} mTorr
            p RF: {{ RF }} Volt              
     .row
      .col-md-8
        .panel.panel-default
          .panel-heading
            | Sequence
          .panel-body
            p Name: {{ Name }}
            p Helium pressure: {{ Helium }} Torr
            p ESC Chucking Voltage: {{ Voltage }} V
            p Expected Cathode Temp: {{ Temp }} C
      .col-md-4
        .panel.panel-default
          .panel-heading
            | WIP
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

