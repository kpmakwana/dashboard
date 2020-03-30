import React, { Component } from 'react';
import Qualifier from './Qualifier';
import './semiFinal.css';
import Spinner from './spinner';
import { connect } from 'react-redux';

const ResultComponent = (props) => {
  return (
    <div className="result-conatiner">
      <div className={"result-label" + (props.isActive ? "" : (props.isFlipped ? " left" : " right") +  "-border")}>
        Winner of QuaterFinal {props.matchId+1}
      </div>
      <div className={"result-value" + (props.isActive ? (props.isFlipped ? " left" : " right") +  "-border" : "")}>
      {props.quaterFinalStatus[props.matchId] === 0
           ? "---"
           : props.quaterFinalStatus[props.matchId] === 2
              ? props.quaterFinalResult[props.matchId].winner
              : <Spinner />
      }
      </div>
    </div>
  )
}


class SemiFinal extends Component {
  render() {
    let qualifierGroupOne = [...this.props.groupInfo].slice(0,2);
    let qualifierGroupTwo = [...this.props.groupInfo].slice(2,4);

    return (
      <div className="semi-final-conatiner">
        { this.props.isFlipped &&
          <ResultComponent {...this.props} />
        }
        <div>
          <Qualifier 
            isActive={true}
            isFlipped={this.props.isFlipped}
            groupInfo={qualifierGroupOne}
            matchId={(this.props.matchId)*2}
          />
          <Qualifier 
            isActive={false}
            isFlipped={this.props.isFlipped}
            groupInfo={qualifierGroupTwo}
            matchId={((this.props.matchId)*2)+ 1}
          />
        </div>
        { !this.props.isFlipped &&
          <ResultComponent {...this.props} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  quaterFinalStatus : state.quaterFinalStatus,
  quaterFinalResult : state.quaterFinalResult
});


export default connect(mapStateToProps)(SemiFinal);