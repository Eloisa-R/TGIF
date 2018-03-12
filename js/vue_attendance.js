/*eslint-env browser*/
/*eslint "no-console": "off" */
/*global $ */

var data_url = ""

var tablesApp = new Vue({
    el: "#tableAttendance",
    data: {
        members: [],
        count: {
            "D": [0, 0],
            "R": [0, 0],
            "I": [0, 0],
            "total": [0, 0],
            "D_voted": 0,
            "R_voted": 0,
            "I_voted": 0,
            "total_voted": 0,
        }
    },

    computed: {
        membersMoreMissed: function () {
            function compare(a, b) {
                if (parseFloat(a.missed_votes_pct) > parseFloat(b.missed_votes_pct)) {
                    return -1;
                } else if (parseFloat(a.missed_votes_pct) < parseFloat(b.missed_votes_pct)) {
                    return 1;
                } else if (parseFloat(a.missed_votes_pct) === parseFloat(b.missed_votes_pct)) {
                    return 0;
                }
            }
            return this.members.sort(compare);
        },
        memberLeastMissed: function () {
            function compare(a, b) {
                if (parseFloat(a.missed_votes_pct) < parseFloat(b.missed_votes_pct)) {
                    return -1;
                } else if (parseFloat(a.missed_votes_pct) > parseFloat(b.missed_votes_pct)) {
                    return 1;
                } else if (parseFloat(a.missed_votes_pct) === parseFloat(b.missed_votes_pct)) {
                    return 0;
                }
            }
            return this.members.sort(compare);
        },
        membersMoreLimit: function () {
            var ten_percent = Math.round(this.members.length / 10)
            return this.membersMoreMissed[ten_percent + 1].missed_votes_pct
        },
        membersLeastLimit: function () {
            var ten_percent = Math.round(this.members.length / 10)
            return this.memberLeastMissed[ten_percent + 1].missed_votes_pct
        }
    },
    methods: {
        countPols: function () {
            this.members.forEach(function (element) {
                tablesApp.count[element.party][0] += 1;
                tablesApp.count[element.party].splice(1, 1, tablesApp.count[element.party][1] + parseFloat(element.votes_with_party_pct));
                tablesApp.count["total"][0] = tablesApp.count["total"][0] + 1;
                tablesApp.count["total"].splice(1, 1, tablesApp.count["total"][1] + parseFloat(element.votes_with_party_pct));
            })
            this.count["D_voted"] = this.count["D"][1] / this.count["D"][0]
            this.count["R_voted"] = this.count["R"][1] / this.count["R"][0]
            this.count["I_voted"] = this.count["I"][1] / this.count["I"][0]
            this.count["total_voted"] = this.count["total"][1] / this.count["total"][0]
        }
    }

})

if ( $( "#senate" ).length ) {
    data_url = senate_url;
} else if ( $( "#house" ).length ) {
    data_url = house_url;
}


$.getJSON(data_url, function (data) {
    data.results[0].members.map(function (member) {
        tablesApp.members.push(member);
    })
    tablesApp.countPols()
})

/*On countPols, to access "count" I have to use the name of the app because otheriwse "this" is bound to the forEach function and it's undefined*/
