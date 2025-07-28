import './QuestionnaireSuccess.css'

const QuestionnaireSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h1>Tak for dine svar!</h1>
        <p>
          Dit spørgeskema er blevet indsendt succesfuldt. 
          Dine svar vil blive gennemgået af klinikkens personale.
        </p>
        <p>
          Du kan nu lukke denne side.
        </p>
        <div className="clinic-info">
          <h3>Har du spørgsmål?</h3>
          <p>Kontakt os på telefon eller email hvis du har spørgsmål til dit forløb.</p>
        </div>
      </div>
    </div>
  )
}

export default QuestionnaireSuccess
