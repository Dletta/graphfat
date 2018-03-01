var ipcRenderer = require('electron').ipcRenderer

var lineArrayPressure = []
lineArrayPressure.push({color:'#ffffff',lineWidth:2,value:0})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:1000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:2000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:3000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:4000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:5000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:6000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:7000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:8000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:9000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:10000})
lineArrayPressure.push({color:'#880000',lineWidth:2,value:11000})

var lineArrayStem = []
lineArrayStem.push({color:'#ffffff',lineWidth:2,value:0})
lineArrayStem.push({color:'#880000',lineWidth:2,value:10})
lineArrayStem.push({color:'#880000',lineWidth:2,value:20})
lineArrayStem.push({color:'#880000',lineWidth:2,value:30})
lineArrayStem.push({color:'#880000',lineWidth:2,value:40})
lineArrayStem.push({color:'#880000',lineWidth:2,value:50})
lineArrayStem.push({color:'#880000',lineWidth:2,value:60})
lineArrayStem.push({color:'#880000',lineWidth:2,value:70})
lineArrayStem.push({color:'#880000',lineWidth:2,value:80})
lineArrayStem.push({color:'#880000',lineWidth:2,value:90})
lineArrayStem.push({color:'#880000',lineWidth:2,value:100})

/* P1, P3, P4 Chart */
let canvP = document.getElementById('graphP')
var Pchart = new SmoothieChart(
  {
    horizontalLines: lineArrayPressure,
    interpolation:'linear',
    maxValueScale: 1.1,
    minValueScale: 1.1,
    timestampFormatter:SmoothieChart.timeFormatter
  })
Pchart.streamTo(canvP, 1000)

/* Stem Position Chart */
let canvS = document.getElementById('graphS')
var Schart = new SmoothieChart(
  {
    maxValue: 100,
    minValue: 0,
    horizontalLines: lineArrayStem,
    interpolation:'linear',
    timestampFormatter:SmoothieChart.timeFormatter
  })
Schart.streamTo(canvS, 1000)

/* Differential Pressure Chart */
let canvDp = document.getElementById('graphDp')
var Dpchart = new SmoothieChart(
  {
    horizontalLines:[{color:'#ffffff',lineWidth:1,value:0},{color:'#880000',lineWidth:2,value:300}],
    interpolation:'linear',
    maxValueScale: 1.1,
    minValueScale: 1.1,
    timestampFormatter:SmoothieChart.timeFormatter
  })
Dpchart.streamTo(canvDp, 1000)

let canvF = document.getElementById('graphF')
var Fchart = new SmoothieChart(
  {
    horizontalLines:[{color:'#ffffff',lineWidth:1,value:0},{color:'#880000',lineWidth:2,value:500},{color:'#880000',lineWidth:2,value:1200}],
    interpolation:'linear',
    maxValueScale: 1.1,
    minValueScale: 1.1,
    timestampFormatter:SmoothieChart.timeFormatter
  })
Fchart.streamTo(canvF, 1000)

/* Define Data Labels based on column headers */
var headers = ['Stem (%)','P4 (psi)','P1 (psi)',
'DP (psi)','DP cts','P3 (psi)','Well (psi)',
'Flow (GPD)','Flow [Stem] (GPD)','Flow [DP] (GPD)',
'Flow [FM] (GPD)','Time','P1 Temp (Â°F)','Temp (Â°F)',
'Raw FM (GPD)','P2 Temp (Â°F)','P3 Temp (Â°F)',
'P4 Temp (Â°F)','P1 cts','P2 cts','P3 cts',
'P4 cts','P1 Temp cts','P2 Temp cts','P3 Temp cts',
'P4 Temp cts','Pcb Temp (Â°F)','Date'
]


/* Global Array holding Headers and Lines of Data */
var file1Data = []
var file2Data = []

/* Create lines for all the data */
for(var i=0; i < headers.length; i++){
  file1Data.push(new TimeSeries())
  file2Data.push(new TimeSeries())
}
/* Add only important data to chart with respective colors */
/* Each data into each respective chart */
Schart.addTimeSeries(file1Data[0], { strokeStyle: 'rgba(77,233,77,1)', lineWidth: 5 })

Pchart.addTimeSeries(file1Data[1], { strokeStyle: 'rgba(77,233,230,1)', lineWidth: 5 })
Pchart.addTimeSeries(file1Data[2], { strokeStyle: 'rgba(66,181,234,1)', lineWidth: 5 })
Pchart.addTimeSeries(file1Data[5], { strokeStyle: 'rgba(180,60,235,1)', lineWidth: 5 })
Fchart.addTimeSeries(file1Data[7], { strokeStyle: 'rgba(4,92,9,1)', lineWidth: 5 })
Fchart.addTimeSeries(file1Data[8], { strokeStyle: 'rgba(10,178,18,1)', lineWidth: 5 })
Fchart.addTimeSeries(file1Data[9], { strokeStyle: 'rgba(15,239,26,1)', lineWidth: 5 })
Fchart.addTimeSeries(file1Data[10], { strokeStyle: 'rgba(124,247,131,1)', lineWidth: 5 })

Dpchart.addTimeSeries(file1Data[3], { strokeStyle: 'rgba(235,97,70,1)', lineWidth: 5 })

Schart.addTimeSeries(file2Data[0], { strokeStyle: 'rgba(39,113,39,1)', lineWidth: 5 })

Pchart.addTimeSeries(file2Data[1], { strokeStyle: 'rgba(50,117,116,1)', lineWidth: 5 })
Pchart.addTimeSeries(file2Data[2], { strokeStyle: 'rgba(49,107,134,1)', lineWidth: 5 })
Pchart.addTimeSeries(file2Data[3], { strokeStyle: 'rgba(134,63,48,1)', lineWidth: 5 })
Pchart.addTimeSeries(file2Data[5], { strokeStyle: 'rgba(101,46,126,1)', lineWidth: 5 })


/*To be executed when user hits start graph button */
var start = function () {

  var file1 = document.getElementById('file')
  if(file1){
    if(file1.files[0] != undefined) {
      file1 = file1.files[0]
    } else {
      file1 = {}
      file1.path = 'None'
    }
  }
  var file2 = document.getElementById('file1')
  if(file2){
    if(file2.files[0] != undefined) {
      file2 = file2.files[0]
    } else {
      file2 = {}
      file2.path = 'None'
    }
  }

  var p = document.getElementById('Init')
  p.style.display = 'none'

  ipcRenderer.send('ready', file1.path, file2.path)
}

/* Receiving new Data from Main */
ipcRenderer.on('newData', (event, message, data, time) => {
  if(message == 'file1'){
    var array = data.split(',')
    if(array.length > 5){
      for(var i=0; i < array.length; i++){
        if(array[i] == ''){
          array[i] = 0
        }
        array[i] = parseFloat(array[i])
        populateData('file1', array[i], i)
        file1Data[i].append(time, array[i])
      }
      console.log('data1 received: ' + array);
    }
  } else if (message == 'file2'){
    var array = data.split(',')
    if(array.length > 5){
      for(var i=0; i < array.length; i++){
        if(array[i] == ''){
          array[i] = 0
        }
        array[i] = parseFloat(array[i])
        populateData('file2', array[i], i)
        file2Data[i].append(time, array[i])
      }
      console.log('data2 received: ' + array);
    }
  }
})

var populateData = function(identifier, data, index){
  if(identifier == 'file1'){
    switch (index){
      case 0:
        var el = document.getElementById('stem1')
        el.innerHTML = data
        break
      case 1:
        var el = document.getElementById('p41')
        el.innerHTML = data
        break
      case 2:
        var el = document.getElementById('p11')
        el.innerHTML = data
        break
      case 3:
        var el = document.getElementById('dp1')
        el.innerHTML = data
        break
      case 5:
        var el = document.getElementById('p31')
        el.innerHTML = data
        break
      case 8:
        var el = document.getElementById('fs1')
        el.innerHTML = data
        break
      case 9:
        var el = document.getElementById('fd1')
        el.innerHTML = data
        break
      case 10:
        var el = document.getElementById('fp1')
        el.innerHTML = data
        break
      default:
        break
    }
  } else if(identifier == 'file2'){
    switch (index){
      case 0:
        var el = document.getElementById('stem2')
        el.innerHTML = data
        break
      case 1:
        var el = document.getElementById('p42')
        el.innerHTML = data
        break
      case 2:
        var el = document.getElementById('p12')
        el.innerHTML = data
        break
      case 3:
        var el = document.getElementById('dp2')
        el.innerHTML = data
        break
      case 5:
        var el = document.getElementById('p32')
        el.innerHTML = data
        break
      default:
        break
    }
  }
}
