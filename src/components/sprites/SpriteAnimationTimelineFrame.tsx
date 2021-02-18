import * as React from "react";
import { findDOMNode } from "react-dom";
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor,
} from "react-dnd";
import styled, { css } from "styled-components";

interface CardWrapperProps {
  selected: boolean;
  isDragging?: boolean;
}

const ItemType = "frame";

export const CardWrapper = styled.div<CardWrapperProps>`
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  cursor: move;

  ${(props) =>
    props.selected
      ? css`
          box-shadow: 0 0 0px 4px ${(props) => props.theme.colors.highlight};
        `
      : ""}
  ${(props) =>
    props.isDragging
      ? css`
          opacity: 0;
        `
      : ""}
`;

const cardSource = {
  beginDrag(props: CardProps) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props: CardProps, monitor: DropTargetMonitor, component: Card | null) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = (findDOMNode(
      component
    ) as Element).getBoundingClientRect();
    // ).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    if (!clientOffset) {
      return;
    }

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

export interface CardProps {
  id: any;
  text: string;
  index: number;
  selected: boolean;
  isDragging?: boolean;
  onSelect: (id: string) => void;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

@DropTarget(ItemType, cardTarget, (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(
  ItemType,
  cardSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)
export default class Card extends React.Component<CardProps> {
  render() {
    const {
      id,
      text,
      selected,
      isDragging,
      onSelect,
      connectDragSource,
      connectDropTarget,
    } = this.props;

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <div onClick={() => onSelect(id)}>
            <CardWrapper
              selected={selected}
              isDragging={isDragging}
            ></CardWrapper>
          </div>
        )
      )
    );
  }
}
