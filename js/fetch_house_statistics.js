/*eslint-env browser*/
/*eslint "no-console": "off" */

var statistics = {
    nDem: 0,
    demWithParty: 0,
    nRep: 0,
    repWithParty: 0,
    nInd: 0,
    indWithParty: 0,
    totalMembers: 0,
    totalWithParty: 0,
    mostMissedVotes: {},
    leastMissedVotes: {},
    mostLoyal: {},
    leastLoyal: {}
}

var myHeaders = new Headers();

myHeaders.append("X-API-Key", "eHv2KDvEnwQa47pZU7mhMDAYiKWRLbM6dGBkPo1y");


var myInit = {
    method: 'GET',
    headers: myHeaders
};

async function fetchData(myInit, stats_obj) {
    try {
        response = await fetch('https://api.propublica.org/congress/v1/113/house/members.json', myInit)
        response.json().then(function (myJson) {
            getDataAtAGlance(myJson.results[0].members, stats_obj);

            populateTableAtAGlance(stats_obj);

            if (document.getElementById("attendance")) {
                getDataAttendance(myJson.results[0].members, stats_obj);
                populateTablesAttendance(stats_obj);
            } else if (document.getElementById("loyalty")) {
                getDataLoyalty(myJson.results[0].members, stats_obj);
                populateTableLoyalty(stats_obj);
            }
        })
    } catch (err) {
        console.log(err)
    }
}

fetchData(myInit, statistics);
