/*eslint-env browser*/
/*eslint "no-console": "off" */
/*global $ */


var tableApp = new Vue({
    el: "#tableHouse",
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


$.getJSON("https://api.myjson.com/bins/1564e1", function (data) {
    tableApp.states_list = data;
})

$(document).ready(function () {
    var control_array = []
    $.getJSON("https://api.myjson.com/bins/w5j7d", function (data) {
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
