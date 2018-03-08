/*eslint-env browser*/
/*eslint "no-console": "off" */

function loadJSON(data) {
    var table = document.getElementsByTagName("tbody")[0];
    var members = data.results[0].members;
    members.forEach(function (element) {
        var new_row = document.createElement("tr");
        var memberObject = {
            full_name: element.last_name + ", " + element.first_name + " " + (element.middle_name || ""),
            party: element.party,
            state: element.state,
            seniority: element.seniority,
            vote_percentage: element.votes_with_party_pct + "%"
        };

        for (var key in memberObject) {
            var new_cell = document.createElement("td");
            var text = document.createTextNode(memberObject[key]);
            if (key === "full_name") {
                var link = document.createElement("a");
                link.append(text);
                link.href = element.url;
                new_cell.append(link);
            } else {
                new_cell.append(text);
            }
            new_row.append(new_cell);
        }

        table.append(new_row);
    })
}

function updateTable(checked_values, selected_value) {
    var table = document.getElementsByTagName("tbody")[0];
    var table_rows = Array.from(table.children);
    if (checked_values.length === 0 && selected_value.length == 0) {
        table_rows.forEach(function (tr) {
            tr.style.display = "table-row";
        })

    } else if (checked_values.length === 0 && selected_value.length != 0) {
        table_rows.forEach(function (tr) {
            if (!selected_value.includes(tr.children[2].textContent.toUpperCase())) {
                tr.style.display = "none";
            } else {
                tr.style.display = "table-row";
            }
        })
    } else if (checked_values.length != 0 && selected_value.length == 0) {
        table_rows.forEach(function (tr) {
            if (!checked_values.includes(tr.children[1].textContent)) {
                tr.style.display = "none";
            } else {
                tr.style.display = "table-row";
            }
        })
    } else if (checked_values.length != 0 && selected_value.length != 0) {
        table_rows.forEach(function (tr) {
            if (selected_value.includes(tr.children[2].textContent.toUpperCase()) && checked_values.includes(tr.children[1].textContent)) {
                tr.style.display = "table-row";
            } else {
                tr.style.display = "none";
            }
        })
    }
    displayNoFound();
}

function getCheckedValues() {
    var checked_values = [];
    var checkboxes = document.getElementsByTagName("input");
    Array.from(checkboxes).forEach(function (boxes) {
        if (boxes.checked) {
            checked_values.push(boxes.value)
        }
    })
    return checked_values;

}

function getSelectionByState() {
    var output_button = Array.from(document.getElementsByClassName("btn-info")).map(function (element) {
        return element.name
    })

    return output_button;

}

function displayNoFound() {
    var table = document.getElementsByTagName("tbody")[0];
    var table_rows = Array.from(table.children);
    var error_message = document.getElementById("errorMessage");
    var check_display = table_rows.every(function (row) {
        return row.style.display === "none"
    });
    if (check_display) {
        error_message.style.display = "table-row";
    } else {
        error_message.style.display = "none";
    }
}

function generateOptionsStateFilter(data) {
    var select_menu = document.getElementById("dropdownStates")
    var statesDict = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "AS": "American Samoa",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MP": "Northern Mariana Islands",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "VI": "Virgin Islands",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    }
    var members = data.results[0].members;
    var json_states = [];
    members.forEach(function (member) {
        if (!json_states.includes(member.state)) {
            json_states.push(member.state)
        }
    });
    var json_states_full_value = json_states.map(function (js_state) {
        return statesDict[js_state]
    })
    json_states_full_value.sort()
    json_states_full_value.forEach(function (js_state_full) {
        var new_option = document.createElement("option");
        new_option.value = Object.keys(statesDict).filter(function (key) {
            return statesDict[key] === js_state_full
        })[0]
        new_option.innerHTML = js_state_full;
        select_menu.append(new_option);
    })

}

function displaySelectOutputBox() {
    var dropdown = document.getElementById("dropdownStates");
    var selected_value = dropdown.options[dropdown.selectedIndex].value;
    var output_button = Array.from(document.getElementsByClassName("btn-info")).map(function (element) {
        return element.name
    })
    if (!output_button.includes(selected_value)) {

        var results_div = document.getElementById("appendResults");
        var selected_text = dropdown.options[dropdown.selectedIndex].textContent;
        var new_content_button = document.createElement("div");
        var close_button = document.createElement("button");
        close_button.innerHTML = "X";
        close_button.classList.add("close-button");
        new_content_button.innerHTML = selected_text;
        new_content_button.classList.add("btn");
        new_content_button.classList.add("btn-info");
        new_content_button.name = selected_value;
        new_content_button.appendChild(close_button);
        results_div.append(new_content_button);
        closeButton();
        dropdown.value = "default";
    } else {
        dropdown.value = "default";
    }
}

function closeButton() {
    var close_button = Array.from(document.getElementsByClassName("close-button"));
    close_button.forEach(function (e) {
        e.onclick = function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
            updateTable(getCheckedValues(), getSelectionByState());
            return false;
        }

    })
}

function activateListeners() {
    var checkboxes = document.getElementsByTagName("input")

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onclick = function () {
            updateTable(getCheckedValues(), getSelectionByState());
        }
    }

    document.getElementById("dropdownStates").onchange = function () {
        displaySelectOutputBox();
        updateTable(getCheckedValues(), getSelectionByState());
    }

}
