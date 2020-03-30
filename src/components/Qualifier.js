import React, { Component } from 'react';
import './qualifier.css'
import GroupItem from './GroupItem';
import Spinner from './spinner';
import { connect } from 'react-redux';

class QualifierResult extends Component {
  render() {
    return(
    <div className="qualifier-result">
      <div className={"result-label" + (this.props.isActive ? "" : (this.props.isFlipped ? " left" : " right") +  "-border")}>Qualifier</div>
      <div className={"result-value" + (this.props.isActive ? (this.props.isFlipped ? " left" : " right") +  "-border" : "")}> 
        {this.props.qualifierStatus[this.props.matchId] === 0
           ? "---"
           : this.props.qualifierStatus[this.props.matchId] === 2
              ? this.props.qualifierResult[this.props.matchId].winner
              : <Spinner />
        }
      </div>
    </div>
  )
  }
} 

class Qualifier extends Component {
  render() {
    let groupOne = this.props.groupInfo[0];
    let groupTwo = this.props.groupInfo[1];

    return (
      <div className="qualifier-conatiner">
         {this.props.isFlipped && (
          <QualifierResult
            {...this.props}
          />
        )}
        <div>
          <GroupItem
            isActive={true}
            groupInfo={this.props.isFlipped ? groupTwo : groupOne}
            isFlipped={this.props.isFlipped}
          />
          <GroupItem
            isActive={false}
            groupInfo={this.props.isFlipped ? groupOne : groupTwo }
            isFlipped={this.props.isFlipped}
          />
        </div>
        {!this.props.isFlipped && (
          <QualifierResult
            {...this.props}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  qualifierStatus : state.qualifierStatus,
  qualifierResult : state.qualifierResult
});

export default connect(mapStateToProps)(Qualifier);