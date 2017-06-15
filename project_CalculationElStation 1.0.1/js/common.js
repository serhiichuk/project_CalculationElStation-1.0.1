// ininial interact.js plugin
interact('.item_icon')
  .draggable({
    snap: {
      targets: [
        interact.createSnapGrid({ x: 25, y: 25 })
      ],
      range: Infinity
    },
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "#_work_space",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener, 
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        x = x - x%25;
        y = y - y%25;

        
    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;


// ------------------------------------------ end initial --------------------------------------

var Elements = {};
var keys = [];
var count_t = 0, count_g = 0, count_c = 0, count_s = 0;
var Uzel = {};
var Vetka = {};

$( document ).ready(function() {

// Add element to work space and create objects
  $('#btn_add').on('click', function () {
    var id = $('.tab-pane.active').attr('id');
    var type = $('.tab-pane.active').attr('data-type');
    var parameters = $('.tab-pane.active > .input-group > input');
    var name_item = $('.tab-pane.active > p').text();   
    
    switch(type) {
      case 'generator': var name = ''+ id + '-'+ count_g++ +''; 
        $('#_work_space').append('<div class="item_icon" data-type="'+ type +'" data-name="'+ name +'"><img src="img/items/generator.svg"/></div>');
        addToItemsList (name_item, name, type, count_g);

      break;

      case 'transformator': var name = ''+ id + '-'+ count_t++ +'';
        $('#_work_space').append('<div class="item_icon" data-type="'+ type +'" data-name="'+ name +'"><img src="img/items/t2.svg"/></div>');
        addToItemsList (name_item, name, type, count_t);

      break;

      case 'shina': var name = ''+ id + '-'+ count_s++ +'';
        $('#_work_space').append('<div class="item_icon resizable_def" data-type="'+ type +'" data-name="'+ name +'">РУ - '+ count_s +'</div>');
        $('#btn_shina').addClass('btn_change')
        $('#btn_shina').removeClass('disabled');
        addToItemsList (name_item, name, type, count_s);

      break;

      case 'conductor-v': var name = ''+ id + '-'+ count_c++ +'';
        $('#_work_space').append('<svg class="item_icon svg-v" data-type="'+ type +'" data-name="'+ name +'" width="25px" height="50px"><line x1="12" y1="0" x2="12" y2="1000" style="stroke-width: 1.8; stroke: black;"></line></svg>');
        addToItemsList (name_item, name, type, count_c);

      break;

      case 'conductor-g': var name = ''+ id + '-'+ count_c++ +'';
        $('#_work_space').append('<svg class="item_icon svg-g" data-type="'+ type +'" data-name="'+ name +'" width="50px" height="25px"><line x1="0" y1="12" x2="1000" y2="12" style="stroke-width: 1.8; stroke: black;"></line></svg>');
        addToItemsList (name_item, name, type, count_c);

      break;
    }

    // Create object width Elements
    Elements[name] = {};
    Elements[name].name = name;
    Elements[name].type = type;
    $.each( parameters, function(i){
      var parameter = parameters[i].dataset.param;
      var value = parameters[i].defaultValue;

      Elements[name][parameter] = value;
            
    });
  });
  //----------------------------------------------------------


// Set coordinates
  $('#btn_res').on('click', function() {
    var Element_list = $('#_work_space').children();

    $.each(Element_list, function(i) {
      var type = $(Element_list[i]).attr('data-type');
      var name = $(Element_list[i]).attr('data-name');
   
      if (type == 'transformator') {
        var x = $(Element_list[i]).attr('data-x');
        var y = $(Element_list[i]).attr('data-y');
        var h = 37.5;

        Elements[name].inp_1_x = +x; 
        Elements[name].inp_1_y = +y - h; 
        Elements[name].inp_2_x = +x; 
        Elements[name].inp_2_y = +y + h; 
      }
   
      if (type == 'generator') {
        var x = $(Element_list[i]).attr('data-x');
        var y = $(Element_list[i]).attr('data-y');
        var h = 37.5;

        Elements[name].inp_1_x = +x; 
        Elements[name].inp_1_y = +y - h; 
        Elements[name].inp_2_x = 0; 
        Elements[name].inp_2_y = 0; 
      }

      if (type == 'shina') {
        var x = $(Element_list[i]).attr('data-x');
        var y = $(Element_list[i]).attr('data-y');
        var w = $(Element_list[i]).width();
        Elements[name].inp_1_x = +x;
        Elements[name].inp_1_y = +y - 37.5;
        Elements[name].inp_2_y = +y - 12.5; 
        Elements[name].inp_2_x = +x + w - 25; 
      }

      if (type == 'conductor-g') {
        var x = $(Element_list[i]).attr('data-x');
        var y = $(Element_list[i]).attr('data-y');
        var w = $(Element_list[i]).width();
        Elements[name].inp_1_x = +x - 25;
        Elements[name].inp_1_y = +y - 37.5;
        Elements[name].inp_2_x = +x + w - 25;
        Elements[name].inp_2_y = +y - 37.5; 
      }

      if (type == 'conductor-v') {
        var x = $(Element_list[i]).attr('data-x');
        var y = $(Element_list[i]).attr('data-y');
        var h = $(Element_list[i]).height();
        Elements[name].inp_1_x = +x - 25;
        Elements[name].inp_1_y = +y - 37.5;
        Elements[name].inp_2_x = +x - 25;
        Elements[name].inp_2_y = +y + h - 37.5; 
      }

    });

    //цикл проверки на соединения
    $.each(Elements, function(i) {
      var T_G_type = Elements[i].type;
      var T_G_name = Elements[i].name;
       
      if ( T_G_type == 'transformator' || T_G_type == 'generator' ) {
        Vetka[T_G_name] = {};
        // присвоение координат Т и Г
        var T_G_inp1x = Elements[i].inp_1_x;
        var T_G_inp1y = Elements[i].inp_1_y;
        var T_G_inp2x = Elements[i].inp_2_x;
        var T_G_inp2y = Elements[i].inp_2_y;
        // перебор шин
        $.each(Elements, function(j) {
          var S_С_type = Elements[j].type;
          var S_С_name = Elements[j].name;

          if ( S_С_type == 'shina' ) {
            // присвоение координат Шины
            var S_inp1x = Elements[j].inp_1_x;
            var S_inp2x = Elements[j].inp_2_x;
            var S_inp1y = Elements[j].inp_1_y;
            var S_inp2y = Elements[j].inp_2_y;

            Uzel[S_С_name] = {}
            Uzel[S_С_name].U = Elements[j].U;

            // проверяем на совпадения по оси Х 
            if ( T_G_inp1x >= S_inp1x && T_G_inp1x <= S_inp2x ) {
              // проверяем выход 1 на совпадения по оси Y
              if (T_G_inp1y == S_inp1y || T_G_inp1y == S_inp2y) {
                Elements[i].out_1 = S_С_name;

                if (T_G_type == 'transformator') {
                  Vetka[T_G_name].R = Elements[i].Ukz;
                  Vetka[T_G_name].out_1 = S_С_name;
                }
                if (T_G_type == 'generator') {
                  Vetka[T_G_name].R = Elements[i].Xd;
                  Vetka[T_G_name].out_1 = S_С_name;
                }
              };
              // проверяем выход 2 на совпадения по оси Y
              if (T_G_inp2y == S_inp1y || T_G_inp2y == S_inp2y) {
                Elements[i].out_2 = S_С_name;
               
                if (T_G_type == 'transformator') {
                  Vetka[T_G_name].R = Elements[i].Ukz;
                  Vetka[T_G_name].out_2 = S_С_name;
                }
                if (T_G_type == 'generator') {
                  Vetka[T_G_name].R = Elements[i].Xd;
                  Vetka[T_G_name].out_2 = S_С_name;
                }
              }
            };
          };

          // // цикл проверки на соединения по проводникам
          // if ( S_С_type == 'conductor-g' || S_С_type == 'conductor-v' ) {

          //   // присвоение координат Проводника
          //   var C_inp1x = Elements[j].inp_1_x;
          //   var C_inp2x = Elements[j].inp_2_x;
          //   var C_inp1y = Elements[j].inp_1_y;
          //   var C_inp2y = Elements[j].inp_2_y;

          //   if ( (T_G_inp1x == C_inp1x) && (T_G_inp1y == C_inp1y) ) {
          //     Elements[j].out_1 = T_G_name;
          //     Elements[i].out_1 = S_С_name;
          //   } else if ( (T_G_inp1x == C_inp2x) && (T_G_inp1y == C_inp2y) ) {
          //     Elements[j].out_1 = T_G_name;
          //     Elements[i].out_1 = S_С_name;
          //   };

          //   if ( T_G_inp2x == C_inp1x && T_G_inp2y == C_inp1y ) {
          //     Elements[j].out_2 = T_G_name;
          //     Elements[i].out_2 = S_С_name;
          //   } else if ( T_G_inp2x == C_inp2x && T_G_inp2y == C_inp2y ) {
          //     Elements[j].out_2 = T_G_name;
          //     Elements[i].out_2 = S_С_name;        
          //   };
          // };  
        });
      }
    });

    console.log(Elements);
    console.log(Uzel);
    console.log(Vetka);
    
    var counterU = 0;
    var counterV = 0;
    for (var key in Uzel) {
      counterU++;
    }
    for (var key in Vetka) {
      counterV++;
    }


    var arr = new Array();

    for(var i=0; i < counterU-1; i++){
      arr[i] = new Array();
      for(var j=0; j< counterV-1; j++){
      arr[i][j] = i+j+1;
    }
  }
    console.log(arr);
  });
function matrixArray(rows,columns){
  var arr = new Array();
  for(var i=0; i<columns; i++){
    arr[i] = new Array();
    for(var j=0; j<rows; j++){
      arr[i][j] = i+j+1;//вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
    }
  }
  return arr;
}
var myMatrix = matrixArray(3,3);
console.log(myMatrix);
// Delete Elements
  $('body').on('click','.del', function() {
    var element = $(this).parent().attr('data-name');
    delete Elements[element];

    $(this).parent().remove();
    $('#_work_space > [data-name = ' + element +']').remove()
  });

// Show current Item
  $('#_work_space').on('click','.item_icon', function() {
    showCurrentItem (this);
  });

  $('#Items_list').on('click','p', function() {
    showCurrentItem (this);
  });

  $('.tab-content').on('click', function() {
    $('#Items_list > p').removeClass('active_item');
    $('#_work_space > .item_icon').removeClass('active_item_on_wp');
  });

// Change conductor size ----------------------------------
  $('#btn_size > .btn').on('click', function() {
    var item = $('.active_item').attr('data-name');
    var type = $('.active_item').attr('data-type');

    if ( type == 'conductor-g' || type == 'shina' ) {
      var val = $('#_work_space > [data-name = ' + item +']').width();

      if ( $(this).text() == '+' && val < 500)
        $('#_work_space > [data-name = ' + item +']').width(val+25);

      if ( $(this).text() == '-' && val > 25)
        $('#_work_space > [data-name = ' + item +']').width(val-25);  

    } else if ( type == 'conductor-v') {
      var val = $('#_work_space > [data-name = ' + item +']').height();

      if ( $(this).text() == '+' && val < 500)
        $('#_work_space > [data-name = ' + item +']').height(val+25);

      if ( $(this).text() == '-' && val > 25)
        $('#_work_space > [data-name = ' + item +']').height(val-25);       
    }
  });


});
//-----------------------------END--------------------------

function addToItemsList (name_item, data, type, num) {
  $('#Items_list').append('<p data-type="'+ type +'" data-name="'+ data +'">'+ name_item +' №'+ num +'<span class="del"></span></p>');
}

function showCurrentItem (item) {
  $('#Items_list > p').removeClass('active_item');
  $('#_work_space > .item_icon').removeClass('active_item_on_wp');

  item = $(item).attr('data-name');
  $('#Items_list > [data-name = ' + item +']').addClass('active_item');
  $('#_work_space > [data-name = ' + item +']').addClass('active_item_on_wp');
}