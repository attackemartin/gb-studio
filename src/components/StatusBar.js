import React, { Component } from "react";
import { connect } from "react-redux";

class StatusBar extends Component {
  render() {
    const { status } = this.props;
    if (!status.mapName) {
      return <div />;
    }
    return (
      <div className="StatusBar">
        {status.mapName !== undefined &&
          <span>
            {status.mapName}
            {": "}
          </span>}
        {status.x !== undefined &&
          <span>
            X={status.x}{" "}
          </span>}
        {status.y !== undefined &&
          <span>
            Y={status.y}{" "}
          </span>}
        {status.actor !== undefined &&
          <span>
            Actor={status.actor}{" "}
          </span>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.navigation.status
  };
}

export default connect(mapStateToProps)(StatusBar);
