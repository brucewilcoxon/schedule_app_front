import styled from "@emotion/styled";

const StyleWrapper = styled.div`
  .fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 0;
  }
  .fc .fc-toolbar-title {
    font-size: 1.3rem;
    color: #37362f;
  }
  .fc .fc-button-primary {
    font-size: 0.75rem;
    background-color: #ffffff00;
    color: #acaba9;
    border: none;
    outline: none;
  }
  .fc .fc-toolbar {
    justify-content: space-around;
  }
  .fc-today-button {
    background-color: #ffffff00;
    color: #37362f;
    border: none;
    outline: none;
  }
  .fc .fc-button-primary:not(:disabled):active,
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: #ffffff00;
    color: #acaba9;
    box-shadow: none;
  }
  .fc .fc-button-primary:not(:disabled):focus,
  .fc .fc-button-primary:not(:disabled).fc-button-focus {
    background-color: #ffffff00;
    color: #acaba9;
    box-shadow: none;
  }
  .fc .fc-today-button:disabled {
    opacity: 1;
  }
  .fc-event-title,
  .fc-event-title-container {
    font-weight: normal !important;
  }
`;

export default StyleWrapper;
