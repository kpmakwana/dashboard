import React, { Component } from 'react';
import './groupItem.css';
import Spinner from './spinner';
import { connect } from 'react-redux';

let GroupInfo = (props) => {
  return (
    <React.Fragment>
      {!props.isFlipped && <div className="group-name"> {props.gropName} </div>}
      <div className="team-container">
        {props.groupMembers.map(team => {
          return <div className="team-name" key={team}>{team}</div>;
        })}
      </div>
      {props.isFlipped && <div className="group-name"> {props.gropName} </div>}
    </React.Fragment>
  );
}

class GroupItem extends Component {
  render() {
    let groupResult = this.props.groupResult[this.props.groupInfo.groupId],
        result = groupResult ? groupResult.result : ''; 
    return (
      <div className={ "group-item-container" +(!this.props.isActive ? ' disable-font' : '')}>
        { !this.props.isFlipped &&  
          <GroupInfo 
            groupMembers={this.props.groupInfo.groupMembers}
            gropName={this.props.groupInfo.groupName}
            isFlipped={this.props.isFlipped}
          />
        }
        <div className="group-result">
          <div className={"result-label" + (this.props.isActive ? "" : (this.props.isFlipped ? " left" : " right") +  "-border")}>
            {"Group "+ this.props.groupInfo.groupName + (this.props.isActive ? " winner" : " runner up")}
          </div>
          <div className={"result-value" + (this.props.isActive ? (this.props.isFlipped ? " left" : " right") +  "-border" : "")}>
            {
              this.props.groupStatus === 1 ?
              <Spinner /> :
              this.props.isActive ? result.winner : result.looser
            }
          </div>
        </div>
        { this.props.isFlipped &&  
          <GroupInfo 
            groupMembers={this.props.groupInfo.groupMembers}
            gropName={this.props.groupInfo.groupName}
            isFlipped={this.props.isFlipped}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groupStatus : state.groupStatus,
  groupResult : state.groupResult
});


export default connect(mapStateToProps)(GroupItem);