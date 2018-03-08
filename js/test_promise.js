/*eslint-env browser*/
/*eslint "no-console": "off" */
/*global $ */

var myHeaders = new Headers();

myHeaders.append("X-API-Key", "eHv2KDvEnwQa47pZU7mhMDAYiKWRLbM6dGBkPo1y");


var myInit = {
    method: 'GET',
    headers: myHeaders
};


var house_data = fetch('https://api.propublica.org/congress/v1/113/house/members.json', myInit).then(function (response) {
    return response.json()
}).then(function(myJson) {
    console.log(myJson.results[0].members);
  });

var senate_data = fetch('https://api.propublica.org/congress/v1/113/senate/members.json', myInit).then(function (response) {
    return response.json()
}).then(function(myJson) {
    console.log(myJson.results[0].members);
  });


//var xhr = new XMLHttpRequest();
//
//$(document).ready(function () {
//    $.ajax({
//        url: 'https://api.propublica.org/congress/v1/113/house/members.json',
//        type: 'GET',
//        dataType: 'json',
//        succes: function (r) {
//            console.log(r)
//        },
//        error: function() {console.log("oops")},
//        beforeSend: setHeader(xhr)
//    })
//})
//
//
//function setHeader(xhr) {
//    xhr.open('GET', 'https://api.propublica.org/congress/v1/113/house/members.json')
//    xhr.setRequestHeader("X-API-Key", "eHv2KDvEnwQa47pZU7mhMDAYiKWRLbM6dGBkPo1y")
//}
