import React, { Component } from 'react';
import SemiFinal from './SemiFinal'
import './final.css';
import Spinner from './spinner';
import { connect } from 'react-redux';

class Final extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupTable: []
    };
  }

  componentDidMount() {
    let isLocalStorage = localStorage.getItem("groupTable") !== null;
    let groupTable;
    if (!isLocalStorage) {
      this.setIntialState();
    } else {
      groupTable = JSON.parse(localStorage.getItem("groupTable"));
      this.setState(
        {
          groupTable: groupTable
        },
        () => {
          this.resumeTournament();
        }
      );
    }
  }

  setIntialState = () => {
    let TeamData = [
      "South Africa",
      "Zimbabwe",
      "West indies",
      "Afghanistan",
      "Bangladesh",
      "India",
      "Pakistan",
      "Sri Lanka",
      "Australia",
      "New Zealand",
      "England",
      "Ireland",
      "Ghana",
      "Kenya",
      "Morocco",
      "Namibia",
      "Nigeria",
      "Swaziland",
      "Tanzania",
      "Uganda",
      "Zambia",
      "Argentina",
      "Bahamas",
      "Bermuda",
      "Brazil",
      "Canada",
      "Chile",
      "Costa Rica",
      "Mexico",
      "Panama",
      "Turky",
      "United States"
    ];

    // Asuming we have 8 group in tournament
    let groupCapacity = Math.floor(TeamData.length / 8);
    let groupTable = this.generateGroups(TeamData, groupCapacity);

    localStorage.setItem("groupTable", JSON.stringify(groupTable));

    this.setState(
      {
        groupTable: groupTable
      },
      () => {
        this.props.dispatch({
          type: "RESET_DATA"
        });
        this.resumeTournament();
      }
    );
  };

  generateGroups = (teams, capacity) => {
    let groups = [];
    for (let j = 0; j < 8; j++) {
      let group = [];
      for (let i = 0; i < capacity; i++) {
        let lengthRemaining = teams.length;
        let selectedTeam = Math.floor(Math.random() * lengthRemaining);
        group.push(teams[selectedTeam]);
        teams.splice(selectedTeam, 1);
      }
      let groupInfo = {
        groupMembers: group,
        groupName: String.fromCharCode(j + 65),
        groupId: j
      };
      groups.push(groupInfo);
    }

    return groups;
  };

  getResult = teams => {
    let competitors = [...teams];
    let winnerIndex = Math.floor(Math.random() * competitors.length);
    let winner = competitors[winnerIndex];
    competitors.splice(winnerIndex, 1);

    let looserIndex = Math.floor(Math.random() * competitors.length);
    let looser = competitors[looserIndex];

    return {
      winner: winner,
      looser: looser
    };
  };

  getResumeIndex = statusArray => {
    let runningIndex = statusArray.indexOf(1);
    let upComingIndex = statusArray.indexOf(0);
    let resumeIndex =
      runningIndex !== -1
        ? runningIndex
        : upComingIndex !== -1
        ? upComingIndex
        : statusArray.length;
    return resumeIndex;
  };

  getGroupResult = () => {
    let groupResult = this.state.groupTable.map(group => {
      return {
        result: this.getResult(group.groupMembers)
      };
    });

    window.setTimeout(() => {
      this.props.dispatch({
        type: "RECORD_GROUP_RESULT",
        data: groupResult
      });
      this.resumeTournament();
    }, 6000);
  };

  getQualifierMatchResult = matchId => {
    let groupResult = this.props.progressTable.groupResult;

    if (matchId < 8) {
      let competitors;
      if (matchId < 4) {
        competitors = [
          groupResult[matchId * 2].result.winner,
          groupResult[matchId * 2 + 1].result.looser
        ];
      } else {
        competitors = [
          groupResult[(matchId - 4) * 2].result.looser,
          groupResult[(matchId - 4) * 2 + 1].result.winner
        ];
      }
      let result = this.getResult(competitors);

      window.setTimeout(() => {
        this.props.dispatch({
          type: "RECORD_QUALIFIER_RESULT",
          data: result,
          index: matchId
        });
        let nextMatchId = matchId + 1;
        this.getQualifierMatchResult(nextMatchId);
      }, 3000);
    } else {
      this.resumeTournament();
    }
  };

  startQualifier = () => {
    let qualifierStatus = this.props.progressTable.qualifierStatus;
    let remainingQualifierIndex = this.getResumeIndex(qualifierStatus);

    this.props.dispatch({
      type: "START_QUALIFIER",
      index: remainingQualifierIndex
    });

    this.getQualifierMatchResult(remainingQualifierIndex);
  };

  getQuaterFinalMatchResult = matchId => {
    let qualifierResult = this.props.progressTable.qualifierResult;
    if (matchId < 4) {
      let competitors = [
        qualifierResult[matchId * 2].winner,
        qualifierResult[matchId * 2 + 1].winner
      ];
      let result = this.getResult(competitors);

      window.setTimeout(() => {
        this.props.dispatch({
          type: "RECORD_QUATER_FINAL_RESULT",
          data: result,
          index: matchId
        });
        let nextMatchId = matchId + 1;
        this.getQuaterFinalMatchResult(nextMatchId);
      }, 3000);
    } else {
      this.resumeTournament();
    }
  };

  startQuaterFinal = () => {
    let quaterFinalStatus = this.props.progressTable.quaterFinalStatus;
    let remainingQuaterFinalIndex = this.getResumeIndex(quaterFinalStatus);

    this.props.dispatch({
      type: "START_QUATERFINAL",
      index: remainingQuaterFinalIndex
    });

    this.getQuaterFinalMatchResult(remainingQuaterFinalIndex);
  };

  startSemiFinal = () => {
    let semiFinalStatus = this.props.progressTable.semiFinalStatus;
    let remainingSemiFinalIndex = this.getResumeIndex(semiFinalStatus);

    this.props.dispatch({
      type: "START_SEMIFINAL",
      index: remainingSemiFinalIndex
    });

    this.getSemiFinalMatchResult(remainingSemiFinalIndex);
  };

  getSemiFinalMatchResult = matchId => {
    let quaterFinalResult = this.props.progressTable.quaterFinalResult;
    if (matchId < 2) {
      let competitors = [
        quaterFinalResult[matchId * 2].winner,
        quaterFinalResult[matchId * 2 + 1].winner
      ];
      let result = this.getResult(competitors);

      window.setTimeout(() => {
        this.props.dispatch({
          type: "RECORD_SEMI_FINAL_RESULT",
          data: result,
          index: matchId
        });
        let nextMatchId = matchId + 1;
        this.getSemiFinalMatchResult(nextMatchId);
      }, 3000);
    } else {
      this.resumeTournament();
    }
  };

  startFinal = () => {
    let finalStatus = this.props.progressTable.finalStatus;
    let remainingFinalIndex = this.getResumeIndex(finalStatus);

    this.props.dispatch({
      type: "START_FINAL",
      index: remainingFinalIndex
    });

    this.finalResult(remainingFinalIndex);
  };

  finalResult = matchId => {
    let semiFinalResult = this.props.progressTable.semiFinalResult;
    let type = matchId ? "looser" : "winner";
    if (matchId < 2) {
      let competitors = [semiFinalResult[0][type], semiFinalResult[1][type]];
      let result = this.getResult(competitors);

      window.setTimeout(() => {
        this.props.dispatch({
          type: "RECORD_FINAL_RESULT",
          data: result,
          index: matchId
        });
        let nextMatchId = matchId + 1;
        this.finalResult(nextMatchId);
      }, 3000);
    } else {
    }
  };

  resumeTournament = () => {
    let progressTable = this.props.progressTable,
      isGroupStageDone = progressTable.groupStatus === 2,
      isQualifierStageDone = progressTable.qualifierStatus.lastIndexOf(2) === 7,
      isQuaterFinalDone = progressTable.quaterFinalStatus.lastIndexOf(2) === 3,
      isSemiFinalDone = progressTable.semiFinalStatus.lastIndexOf(2) === 1,
      isFinalDone = progressTable.finalStatus.lastIndexOf(2) === 1;
    if (!isGroupStageDone) {
      this.getGroupResult();
    } else if (!isQualifierStageDone) {
      this.startQualifier();
    } else if (!isQuaterFinalDone) {
      this.startQuaterFinal();
    } else if (!isSemiFinalDone) {
      this.startSemiFinal();
    } else if (!isFinalDone) {
      this.startFinal();
    }
  };

  componentDidUpdate() {
    if(this.props.progressTable.groupStatus === 1 ){
      this.resumeTournament();
    }
    localStorage.setItem(
      "progressTable",
      JSON.stringify(this.props.progressTable)
    );
  }

  render() {
    if (this.state.groupTable.length) {
      let semiGroupOne = [...this.state.groupTable].slice(0, 4);
      let semiGroupTwo = [...this.state.groupTable].slice(4, 8);
      return (
        <div className="final-container">
          <div>
            <SemiFinal
              isFlipped={false}
              isActive={true}
              groupInfo={semiGroupOne}
              matchId={0}
            />
            <SemiFinal
              isFlipped={false}
              isActive={false}
              groupInfo={semiGroupTwo}
              matchId={1}
            />
          </div>
          <div className="final-result-conatiner">
            <FinalResult
              matchType={1}
              matchId={0}
              semiFinalResult={this.props.progressTable.semiFinalResult}
              semiFinalStatus={this.props.progressTable.semiFinalStatus}
              finalResult={this.props.progressTable.finalResult}
              finalStatus={this.props.progressTable.finalStatus}
            />
            <FinalResult
              matchType={0}
              matchId={1}
              semiFinalResult={this.props.progressTable.semiFinalResult}
              semiFinalStatus={this.props.progressTable.semiFinalStatus}
              finalResult={this.props.progressTable.finalResult}
              finalStatus={this.props.progressTable.finalStatus}
            />
          </div>
          <div>
            <SemiFinal
              isFlipped={true}
              isActive={true}
              groupInfo={semiGroupOne}
              matchId={2}
            />
            <SemiFinal
              isFlipped={true}
              isActive={false}
              groupInfo={semiGroupTwo}
              matchId={3}
            />
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

class FinalResult extends Component {
  resetTournament = () => {
    localStorage.clear();
    window.location.reload();
  }
  render() {
    let props = this.props;
    let semiFinalResult = props.semiFinalResult;
    let semiFinalStatus = props.semiFinalStatus;
    let finalResult = props.finalResult;
    let finalStatus = props.finalStatus;

    return (
      <div className="results-conatiner">
        <div className="semi-winner-conatiner">
          <div className="result-label">
            {props.matchType ? "Winner " : "Looser "} of semiFinal 1
            </div>
          <div className="result-value">
          { semiFinalStatus[0] === 0
           ? "---"
           : semiFinalStatus[0] === 2
              ? props.matchType === 1 ? semiFinalResult[0].winner : semiFinalResult[0].looser
              : <Spinner />
          }
          </div>
        </div>
        <div className="result">
          <div className="result-label">
          { finalStatus[props.matchId] === 0
           ? "---"
           : finalStatus[props.matchId] === 2
              ? finalResult[props.matchId].winner
              : <Spinner />
          }
          </div>
          <div className="result-value">
            {props.matchType ? "Champion" : "3rd Place" }
          </div>
          <div className="result-label">
          { finalStatus[props.matchId] === 0
           ? "---"
           : finalStatus[props.matchId] === 2
              ? finalResult[props.matchId].looser
              : <Spinner />
          }
          </div>
          <div className="result-value">
            {props.matchType ? "Runners up" : "4th Place" }
            {this.props.matchType &&
              <button className="reset-button" onClick={this.resetTournament}> 
                Restart Tournament 
              </button>
            }
          </div>
        </div>
        <div className="semi-winner-conatiner">
          <div className="result-label">
            {props.matchType ? "Winner " : "Looser "} of semiFinal 2
          </div>
          <div className="result-value">
          { semiFinalStatus[1] === 0
           ? "---"
           : semiFinalStatus[1] === 2
              ? props.matchType === 1 ? semiFinalResult[1].winner : semiFinalResult[1].looser
              : <Spinner />
          }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  progressTable : state
});


export default connect(mapStateToProps)(Final);