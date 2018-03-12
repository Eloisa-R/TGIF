/*eslint-env browser*/
/*eslint "no-console": "off" */
/*global $ */

var data_url = ""

var tableApp = new Vue({
    el: "#tableData",
    data: {
        members: [],
        selected: "disabled",
        options: [],
        checkedParties: [],
        selectedStatesArray: [],
        states_list: {}
    },

    methods: {
        addToArray: function () {
            if (!this.selectedStatesArray.includes(this.selected)) {
                this.selectedStatesArray.push(this.selected)
            }
            this.selected = "disabled"
        },
        removeFromArray: function () {
            this.selectedStatesArray.splice(this.selectedStatesArray.indexOf(event.target.parentElement.getAttribute('value')), 1)

        }
    }

})


$.getJSON(states_json_url, function (data) {
    tableApp.states_list = data;
})

if ( $( "#senate" ).length ) {
    data_url = senate_url;
} else if ( $( "#house" ).length ) {
    data_url = house_url;
}

$(document).ready(function () {
    var control_array = []
    $.getJSON(data_url, function (data) {
        data.results[0].members.map(function (member) {
            tableApp.members.push(member);
            if (!control_array.includes(member.state)) {
                control_array.push(member.state)
            }
        })
        control_array.sort().forEach(function (state) {
            tableApp.options.push({
                text: tableApp.states_list[state],
                value: state
            })
        })
    })
})
