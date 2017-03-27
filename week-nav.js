/**
 * Plugin para navegación por semanas
 * 
 * Dependencias: jQuery
 * Date: 2015-10-05
 * 
 * @author Diego Malagón <diegomalagonh@gmail.com>
 * @param {type} $ jQuery
 * @returns {undefined}
 */
(function ($) {

    var Weeknav = function(){    
        
        var $element;
        var options;
        var $btn_prev, $btn_next, $btn_this_week, $btn_cal, $label;
        var date, back_date, first_week_day, last_week_day;
        
        // Initialize / GUI
        
        /**
         * Funcion que crea todo los objetos DOM para weeknav
         * @returns {undefined}
         */
        var initGUI = function(){

            // Contenedor de botones
            var $container = $('<div class="'+ options.classes.button_group +'"></div>');

            // Boton anterior
            $btn_prev = $('<button type="button" class="'+ options.classes.button +'"></button>');        
            var $icon_prev = $('<i class="'+ options.icon_font.prev +'"></i>');        
            $btn_prev.html($icon_prev);
            $container.append($btn_prev);

            // Boton semana actual
            $btn_this_week = $('<button type="button" class="'+ options.classes.button +'">'+ options.text.this_week +'</button>');
            $container.append($btn_this_week);

            // Label
            $label = $('.'+options.classes.label);

            // Boton siguiente
            $btn_next = $('<button type="button" class="'+ options.classes.button +'"></button>'); 
            var $icon_next = $('<i class="'+ options.icon_font.next +'"></i>');        
            $btn_next.html($icon_next);
            $container.append($btn_next);

            // Boton de calendario
            $btn_cal = $('<button type="button" class="'+ options.classes.button +' '+ options.classes.button_cal +'"></button>');
            var $icon_cal = $('<i class="'+ options.icon_font.cal +'"></i>');
            $btn_cal.html($icon_cal);
            $container.append($btn_cal);

            // Agregar a contenedor principal
            $element.html($container);
        };
        
        /**
         * Funcion que asigna eventos a los controles
         * @returns {undefined}
         */
        var initEvents = function(){

            // Evento para botón anterior
            $btn_prev.on('click', prevHandler);

            // Evento para botón siguiente
            $btn_next.on('click', nextHandler);

            // Evento para el botón semana actual
            $btn_this_week.on('click', thisWeekHandler);

            // Agregar funcionalidad datepicker al botón de calendario
            $btn_cal.datepicker(options.datepicker).on('changeDate', datePickerHandler);
        };

        /**
         * Funcion para actualizar el label de rango de fechas de semana
         * @returns {undefined}
         */
        var updateLabel = function(){
           var text = dateToString(first_week_day) + " - " + dateToString(last_week_day);
           $label.html(text);
        };
        
        // Handlers
    
        /**
         * Manejador para el botón anterior
         * @returns {undefined}
         */
        var prevHandler = function(){
            changeWeek(-1);
        };

        /**
         * Manejador para el botón siguiente
         * @returns {undefined}
         */
        var nextHandler = function(){
            changeWeek(1);
        };

        /**
         * Manejador para el boton semana actual
         * @returns {undefined}
         */
        var thisWeekHandler = function(){
            // Resetear fecha a la fecha inicial
            date = new Date();

            // Actualizar rango de fechas para la semana
            updateDateRange();
        };

        /**
         * Controlador para el datepicker
         * @param {Object} e evento disparado por el datepicker
         * @returns {undefined}
         */
        var datePickerHandler = function(e){
            // Establecer date como la fecha seleccionada en el datepicker
            date = new Date(e.date);

            // Actualizar rango de fechas para la semana
            updateDateRange();
        };
        
        // Functions
        
        /**
         * Funcion que ejecuta el callback
         * @returns {undefined}
         */ 
        var executeCallback = function(f){
            
            var func = (f) ? f : options.change;
            
            if(typeof(func) === "function"){
                var start = first_week_day.getTime();
                var end = last_week_day.getTime();
                var dates = getWeekDates();

                func({
                    start: start, 
                    end: end, 
                    dates: dates
                });
            }
        };
                
        /**
         * Funcion que obtiene el primer dia de la semana segun la fecha pasada como parametro
         * @param {Date Object} d
         * @returns {String}
         */
        var getFirstWeekDay = function(d){

            var first_day = new Date(d);

            // Obtener el numero del dia en la semana del parametro date 0:domingo, 6:sabado
            var day = d.getDay();

            // Horas a restar para obtener el primer dia de la semana
            var h = parseInt(day*24*(-1));

            // Restar horas para obtener fecha del primer dia de la semana
            first_day.setHours(h);

            // Establecer horas, minutos y segundos en 00:00:00
            first_day.setHours(0);
            first_day.setMinutes(0);
            first_day.setSeconds(0);
            first_day.setMilliseconds(0);

            return first_day;
        };

        /**
         * Funcion que obtiene el ultimo dia de la semana segun la fecha pasada como parametro
         * @param {Date Object} d
         * @returns {String}
         */
        var getLastWeekDay = function(d){

            var last_day = new Date(d);

            // Obtener el numero del dia en la semana del parametro date 0:domingo, 6:sabado
            var day = d.getDay();

            // Horas a sumar para obtener el ultimo dia de la semana
            var h = parseInt((6-day)*24);

            // Sumar horas para obtener la fecha del ultimo dia de la semana
            last_day.setHours(h);

            // Establecer horas, minutos y segundos en 23:59:59
            last_day.setHours(23);
            last_day.setMinutes(59);
            last_day.setSeconds(59);
            last_day.setMilliseconds(999);

            return last_day;
        };

        /**
         * Funcion que retorna un string de la fecha pasada como parametro
         * @param {type} d
         * @returns {String}
         */
        var dateToString = function(d){
            var year = d.getFullYear().toString();
            var month = d.getMonth().toString();
            var day = d.getDate().toString();

            var str = day + " " + options.strings_months[month] + " " + year;

            return str;
        };

        /**
         * Funcion que actualiza el rango de fechas segun el valor de la variable date
         * @returns {undefined}
         */
        var updateDateRange = function(){
            // Calcular inicio de semana
            first_week_day = getFirstWeekDay(date);

            // Calcular fin de semana
            last_week_day = getLastWeekDay(date);   

            // Actualizar label
            updateLabel();

            // Ejecutar callback
            executeCallback();
        };

        /**
         * Funcion para aumentar o disminuir semanas
         * 
         * @param {type} num
         * @returns {undefined}
         */
        var changeWeek = function(num){
            
            back_date = new Date(date);
            
            // Numero de horas de una semana
            var h = parseInt(24*7*num);

            // Sumar o restar horas a date
            date.setHours(h);

            // Actualizar rango de fechas para la semana
            updateDateRange();
        };

        /**
         * Funcion que calcula cada fecha de los dias de la semana
         * @returns {undefined}
         */
        var getWeekDates = function(){

            var d = new Date(first_week_day);
            var today = new Date();
            var dates = [];
            var item_date, item_today;

            // Establecer la fecha de hoy sin horas, minutos, etc.
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            for(var i = 0; i <= 6; i++){

                item_date = new Date(d);

                if(today.getTime() === item_date.getTime()){
                    item_today = true;
                }
                else{
                    item_today = false;
                }

                dates[i] = {
                    date:   item_date,
                    today:  item_today,
                    label:  options.strings_days[i],
                    label_date: item_date.getDate() + " " + options.strings_months[item_date.getMonth()]                
                };

                // Agregar un dia
                d.setHours(24);
            }

            return dates;
        };
            
        return {
        
            init: function (element, opts) {

                $element = $(element);
                options = opts;
                date = (options.date) ? new Date(options.date) : new Date();
                back_date = new Date(date);
                first_week_day = getFirstWeekDay(date);
                last_week_day = getLastWeekDay(date);

                initGUI();  
                initEvents();
                
                if(options.init_cb){
                    executeCallback();
                }
                
                updateLabel();
            },
            
            setDate: function(args){
                date = new Date(args.date);
                
                first_week_day = getFirstWeekDay(date);
                last_week_day = getLastWeekDay(date);
                
                updateLabel();
                
                if(typeof(args.callback) === "function"){
                    executeCallback(args.callback);
                }
            },
            
            back: function(args){
                date = new Date(back_date);
                
                first_week_day = getFirstWeekDay(date);
                last_week_day = getLastWeekDay(date);
                
                updateLabel();
            },

            prev: function(args){
                prevHandler();
            },

            next: function(args){
                nextHandler();
            }
        };
    }();

    $.fn.weeknav = function(options, args){        
        var element = this;
        
        if(Weeknav[options]){
            return Weeknav[options](args);
        }
        else if(typeof(options) === "object" || !options){
            
            options = $.extend({}, $.fn.weeknav.defaults, options );
            
            return Weeknav.init(element, options, args);
        }
    };

    $.fn.weeknav.defaults = {
        icon_font: {
            prev: 'fa fa-angle-left',
            next: 'fa fa-angle-right',
            cal: 'fa fa-calendar' 
        },
        classes: {
            button: 'btn btn-default',
            button_cal: 'date date-picker',
            button_group: 'btn-group',
            label: 'weeknav-label'
        },
        text: {
            this_week: Translator.trans("esta.semana")
        },
        datepicker: {
            isRTL: App.isRTL(),
            autoclose: true,
            language: Translator.locale,
            format: "dd/mm/yyyy"
        },
        strings_months: [Translator.trans("Ene"), Translator.trans("Feb"), Translator.trans("Mar"), Translator.trans("Abr"), Translator.trans("May"), Translator.trans("Jun"), Translator.trans("Jul"), Translator.trans("Ago"), Translator.trans("Sep"), Translator.trans("Oct"), Translator.trans("Nov"), Translator.trans("Dic")],
        strings_days:   [Translator.trans('Do'), Translator.trans('Lu'), Translator.trans('Ma'), Translator.trans('Mi'), Translator.trans('Ju'), Translator.trans('Vi'), Translator.trans('Sa')],
        // Función callback que se ejecuta al cambiar de semana
        change: false,
        // Indica si el callback se ejecuta también al inicializar
        init_cb: true
    };

})(jQuery);