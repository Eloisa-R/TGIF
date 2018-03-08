/*eslint-env browser*/
/*eslint "no-console": "off" */

function getDataAtAGlance(data, stats_obj) {
    var r_counter = 0;
    var d_counter = 0;
    var i_counter = 0;
    var r_votes = 0;
    var d_votes = 0;
    var i_votes = 0;
    var total_votes = 0;

    data.forEach(function (member) {

        total_votes += member.votes_with_party_pct;

        if (member.party === "R") {
            r_counter += 1;
            r_votes += member.votes_with_party_pct;

        } else if (member.party === "D") {
            d_counter += 1;
            d_votes += member.votes_with_party_pct;
        } else if (member.party === "I") {
            i_counter += 1;
            i_votes += member.votes_with_party_pct;
        }
    })


    stats_obj.nDem = d_counter;
    stats_obj.demWithParty = (d_votes / d_counter) || 0;
    stats_obj.nRep = r_counter;
    stats_obj.repWithParty = (r_votes / r_counter) || 0;
    stats_obj.nInd = i_counter;
    stats_obj.indWithParty = (i_votes / i_counter) || 0;
    stats_obj.totalMembers = data.length;
    stats_obj.totalWithParty = (total_votes / data.length).toFixed(2);
}

function populateTableAtAGlance(stats_obj) {
    var table_glance = document.getElementById("atAGlance");
    var rows_array = Array.from(table_glance.tBodies[0].children);
    rows_array.forEach(function (row) {
        if (row.children[0].textContent == "Democrats") {
            row.insertCell(1).innerHTML = stats_obj.nDem;
            row.insertCell(2).innerHTML = stats_obj.demWithParty.toFixed(2) + "%";
        } else if (row.children[0].textContent == "Republicans") {
            row.insertCell(1).innerHTML = stats_obj.nRep;
            row.insertCell(2).innerHTML = stats_obj.repWithParty.toFixed(2) + "%";
        } else if (row.children[0].textContent == "Independents") {
            row.insertCell(1).innerHTML = stats_obj.nInd;
            row.insertCell(2).innerHTML = stats_obj.indWithParty.toFixed(2) + "%";
        } else if (row.children[0].textContent == "Total") {
            row.insertCell(1).innerHTML = stats_obj.totalMembers;
            row.insertCell(2).innerHTML = stats_obj.totalWithParty + "%";
        }
    })
}

//Get the number that represents the 10% of the members (lenght of array divided by 10). Create an object with the member id as a key (cause it's unique) and as value an array with the percentage of missed votes, number of missed votes and the name of the member.
//Then get all the values of that object and create an array with the first member of each of the values and sort it
//to get smaller to bigger (and bigger to smaller). Then get the first elements until reaching 10% and put them in an array (and the last 10% for the biggest). Then for each member of that array, get a member whose first item of the value equals the element of the array.
function getDataAttendance(data, stats_obj) {
    var members_ten_percent = data.length / 10;

    var all_members = {}

    data.forEach(function (member) {
        all_members[member.id] = [member.missed_votes_pct, member.missed_votes, member.last_name + ", " + member.first_name + " " + (member.middle_name || "")];
    })
    var all_values_members = Object.values(all_members);
    var all_missed_percn = all_values_members.map(function (element) {
        return element[0]
    })
    var lowest_ten_percent = all_missed_percn.sort().slice(0, members_ten_percent);
    var highest_ten_percent = all_missed_percn.sort().reverse().slice(0, members_ten_percent);

    lowest_ten_percent.forEach(function (percent) {
        for (var member_key in all_members) {
            if (all_members[member_key][0] == percent) {
                stats_obj.leastMissedVotes[all_members[member_key][2]] = [all_members[member_key][1], all_members[member_key][0]]
            }
        }
    })

    highest_ten_percent.forEach(function (percent_h) {
        for (var member_key_h in all_members) {
            if (all_members[member_key_h][0] == percent_h) {
                stats_obj.mostMissedVotes[all_members[member_key_h][2]] = [all_members[member_key_h][1], all_members[member_key_h][0]]
            }
        }
    })

}

function populateTablesAttendance(stats_obj) {
    var table_low = document.getElementById("bottomAttendance").tBodies[0];
    var table_high = document.getElementById("topAttendance").tBodies[0];

    for (var key in stats_obj.mostMissedVotes) {
        var new_row = table_low.insertRow();
        new_row.insertCell(0).innerHTML = key;
        new_row.insertCell(1).innerHTML = stats_obj.mostMissedVotes[key][0];
        new_row.insertCell(2).innerHTML = stats_obj.mostMissedVotes[key][1];
    }

    for (var key_least in stats_obj.leastMissedVotes) {
        var new_row_high = table_high.insertRow();
        new_row_high.insertCell(0).innerHTML = key_least;
        new_row_high.insertCell(1).innerHTML = stats_obj.leastMissedVotes[key_least][0];
        new_row_high.insertCell(2).innerHTML = stats_obj.leastMissedVotes[key_least][1];
    }
}

function getDataLoyalty(data, stats_obj) {
    var members_ten_percent = data.length / 10;

    var all_members = {}

    data.forEach(function (member) {
        all_members[member.id] = [member.votes_with_party_pct, member.total_votes, member.last_name + ", " + member.first_name + " " + (member.middle_name || "")];
    })
    var all_values_members = Object.values(all_members);
    var all_votes_with_party = all_values_members.map(function (element) {
        return element[0]
    })
    var lowest_votes_with_party = all_votes_with_party.sort().slice(0, members_ten_percent);
    var highest_votes_with_party = all_votes_with_party.sort().reverse().slice(0, members_ten_percent);


    lowest_votes_with_party.forEach(function (percent) {
        for (var member_key in all_members) {
            if (all_members[member_key][0] == percent) {
                stats_obj.leastLoyal[all_members[member_key][2]] = [all_members[member_key][1], all_members[member_key][0]]
            }
        }
    })

    highest_votes_with_party.forEach(function (percent_h) {
        for (var member_key_h in all_members) {
            if (all_members[member_key_h][0] == percent_h) {
                stats_obj.mostLoyal[all_members[member_key_h][2]] = [all_members[member_key_h][1], all_members[member_key_h][0]]
            }
        }
    })

}

function populateTableLoyalty(stats_obj) {
    var table_less = document.getElementById("lessLoyal").tBodies[0];
    var table_most = document.getElementById("mostLoyal").tBodies[0];

    for (var key in stats_obj.mostLoyal) {
        var new_row = table_most.insertRow();
        new_row.insertCell(0).innerHTML = key;
        new_row.insertCell(1).innerHTML = stats_obj.mostLoyal[key][0];
        new_row.insertCell(2).innerHTML = stats_obj.mostLoyal[key][1];
    }

    for (var key_less in stats_obj.leastLoyal) {
        var new_row_less = table_less.insertRow();
        new_row_less.insertCell(0).innerHTML = key_less;
        new_row_less.insertCell(1).innerHTML = stats_obj.leastLoyal[key_less][0];
        new_row_less.insertCell(2).innerHTML = stats_obj.leastLoyal[key_less][1];
    }
}
