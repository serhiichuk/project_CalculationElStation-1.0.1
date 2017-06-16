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
var count_t = 0, count_g = 0, count_c = 0, count_s = 0;


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

      Elements[name][parameter] = parseFloat(value);
            
    });
  });
  //----------------------------------------------------------


  // Set coordinates
  $('#btn_res').on('click', function() {
    var Element_list = $('#_work_space').children();   
    var Uzel = {};
    var Vetka = {};

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
            Uzel[S_С_name].name = S_С_name;

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

    // ----------matrix A -----------------------------------
    var html = '<p><b>Матриця А:</b></p><div class="matrix matrix-a">';
    var arr_A = new Array();
    var r = 0;
  
    $.each(Uzel, function(i) {

      var arr_r = new Array();
      var n = 0;
      html += '<p>'
      $.each(Vetka, function(j) {
        
        if (Uzel[i].name == Vetka[j].out_1) {
          arr_r[n] = 1;
        } else if (Uzel[i].name == Vetka[j].out_2) {
          arr_r[n] = -1;
        } else {
          arr_r[n] = 0;
        } 
        arr_A[r] = (arr_r);
        html += '<span>'+ arr_r[n] +'</span>'
        n++;
      });
      html += '</p>'
      r++;
    });
    html += '</div>';

    // ------------matrix Zb -------------
    var arr_Zb = new Array();
    r = 0;
    html += '<p><b>Матриця Z<sub>B</sub>:</b></p><div class="matrix matrix-zb">'
    $.each(Vetka, function(i) {
      html += '<p>'
      var arr_r = new Array();
      var n = 0;

      $.each(Vetka, function(j) {

        if (r == n) {
          arr_r[n] = Vetka[j].R;
        } else {
          arr_r[n] = 0;
        } 
        arr_Zb[r] = (arr_r);
        html += '<span>'+ arr_r[n] +'</span>'
        n++;
      });
      html += '</p>'
      r++;
    });
    html += '</div>';
  
    // ---------matrix Zy = (A*Zb^-1*A^t)^-1 --------------------------------------------
  
    var Zb_ob = InverseMatrix(arr_Zb);
    // console.log('Zb -1 ',Zb_ob);
    var AZb_ob = MultiplyMatrix(arr_A, Zb_ob);
    // console.log('A*Zb-1 ',AZb_ob);
    var A_t = TransMatrix(arr_A);
    // console.log('At ',A_t)
    var AZb_obA_t = MultiplyMatrix (AZb_ob, A_t);
    // console.log('A*Zb-1*At ',AZb_obA_t);
    var Zy = InverseMatrix(AZb_obA_t);
    // console.log('Zy -1 ',Zy);

    html += '<p><b>Матриця Z<sub>y</sub>:</b></p><div class="matrix matrix-zy">'

    $.each(Zy, function(i){
      html += '<p>';
      $.each(Zy, function(j){
        html += '<span>'+ Zy[i][j].toFixed(3) +'</span>';
      });
      html += '</p>';
    });

  // display result
    $('#matrix_A').html(html);
  });
//-------------------------------------------------------------------------

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

  // Change mode -----------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  $('body').on('click', '.active_item', function() {
    var chek = $(''+$(this)+'> .check');
    // if $(this > '.check') {
    console.log(chek);
    // }
  });

});
//-----------------------------END--------------------------

function addToItemsList (name_item, data, type, num) {
  if ( type == 'shina') {
    $('#Items_list').append('<p data-type="'+ type +'" data-name="'+ data +'">'+ name_item +' №'+ num +'   КЗ: <input id="'+ name_item +'" class="check" type="checkbox" aria-label="..."><span class="del"></span></p>');
  } else {
    $('#Items_list').append('<p data-type="'+ type +'" data-name="'+ data +'">'+ name_item +' №'+ num +'<span class="del"></span></p>');
  }
}

function showCurrentItem (item) {
  $('#Items_list > p').removeClass('active_item');
  $('#_work_space > .item_icon').removeClass('active_item_on_wp');

  item = $(item).attr('data-name');
  $('#Items_list > [data-name = ' + item +']').addClass('active_item');
  $('#_work_space > [data-name = ' + item +']').addClass('active_item_on_wp');
}

//Транспонування матриць
function TransMatrix(A)     
{
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++)
     { AT[i] = [];
       for (var j = 0; j < m; j++) AT[i][j] = A[j][i];
     }
    return AT;
}

//Додавання матриць
function SumMatrix(A,B)       
{   
    var m = A.length, n = A[0].length, C = [];
    for (var i = 0; i < m; i++)
     { C[i] = [];
       for (var j = 0; j < n; j++) C[i][j] = A[i][j]+B[i][j];
     }
    return C;
}

//Множення матриці на число
function multMatrixNumber(a,A)  // a - число, A - матриця 
{   
    var m = A.length, n = A[0].length, B = [];
    for (var i = 0; i < m; i++)
     { B[i] = [];
       for (var j = 0; j < n; j++) B[i][j] = a*A[i][j];
     }
    return B;
}
//Множення матриць
function MultiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[i] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++) t += A[i][j]*B[j][k];
          C[i][k] = t;
        }
     }
    return C;
}

//Піднесення матриці в степінь
function MatrixPow(n,A)
{ 
    if (n == 1) return A;    
    else return MultiplyMatrix( A, MatrixPow(n-1,A) );
}

//Визначник матриці
function Determinant(A)   //алгоритм Барейса
{
    var N = A.length, B = [], denom = 1, exchanges = 0;
    for (var i = 0; i < N; ++i)
     { B[i] = [];
       for (var j = 0; j < N; ++j) B[i][j] = A[i][j];
     }
    for (var i = 0; i < N-1; ++i)
     { var maxN = i, maxValue = Math.abs(B[i][i]);
       for (var j = i+1; j < N; ++j)
        { var value = Math.abs(B[j][i]);
          if (value > maxValue){ maxN = j; maxValue = value; }
        }
       if (maxN > i)
        { var temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
          ++exchanges;
        }
       else { if (maxValue == 0) return maxValue; }
       var value1 = B[i][i];
       for (var j = i+1; j < N; ++j)
        { var value2 = B[j][i];
          B[j][i] = 0;
          for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[i][k]*value2)/denom;
        }
       denom = value1;
     }
    if (exchanges%2) return -B[N-1][N-1];
    else return B[N-1][N-1];
}

//Ранг матриці
function MatrixRank(A)
{
    var m = A.length, n = A[0].length, k = (m < n ? m : n), r = 1, rank = 0;
    while (r <= k)
     { var B = [];
       for (var i = 0; i < r; i++) B[i] = [];
       for (var a = 0; a < m-r+1; a++)
        { for (var b = 0; b < n-r+1; b++)
           { for (var c = 0; c < r; c++)
              { for (var d = 0; d < r; d++) B[c][d] = A[a+c][b+d]; }
             if (Determinant(B) != 0) rank = r;
           }       
        }
       r++;
     }
    return rank;
}

//Союзна матриця
function AdjugateMatrix(A)  
{                                        
    var N = A.length, adjA = [];
    for (var i = 0; i < N; i++)
     { adjA[i] = [];
       for (var j = 0; j < N; j++)
        { var B = [], sign = ((i+j)%2==0) ? 1 : -1;
          for (var m = 0; m < j; m++)
           { B[m] = [];
             for (var n = 0; n < i; n++)   B[m][n] = A[m][n];
             for (var n = i+1; n < N; n++) B[m][n-1] = A[m][n];
           }
          for (var m = j+1; m < N; m++)
           { B[m-1] = [];
             for (var n = 0; n < i; n++)   B[m-1][n] = A[m][n];
             for (var n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
           }
          adjA[i][j] = sign*Determinant(B);  
        }
     }
    return adjA;
}

//Обернена матриця
function InverseMatrix(A)   
{   
    var det = Determinant(A);  
    if (det == 0) return false;
    var N = A.length, A = AdjugateMatrix(A);
    for (var i = 0; i < N; i++)
     { for (var j = 0; j < N; j++) A[i][j] /= det; }
    return A;
}