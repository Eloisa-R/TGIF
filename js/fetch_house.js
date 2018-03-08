/*eslint-env browser*/
/*eslint "no-console": "off" */

var myHeaders = new Headers();

myHeaders.append("X-API-Key", "eHv2KDvEnwQa47pZU7mhMDAYiKWRLbM6dGBkPo1y");


var myInit = {
    method: 'GET',
    headers: myHeaders
};

async function fetchData(myInit) {
    try {
        response = await fetch('https://api.propublica.org/congress/v1/113/house/members.json', myInit)
        response.json().then(function (myJson) {
            loadJSON(myJson);
            activateListeners();
            generateOptionsStateFilter(myJson);
        })
    } catch (err) {
        console.log(err)
    }
}

fetchData(myInit);