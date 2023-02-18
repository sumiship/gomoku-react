import { FIELD_SIZE } from '../../modules/constants'
import { Field } from '../../modules/field'
import './Field.css'

export type Props = {
  field: Field
  disabled: boolean
  cellClick: (coordinateCode: number) => void
}

const FieldComponent: React.FC<Props> = ({ field, disabled, cellClick }) => {
  return (
    <div className="FieldComponent">
      {field.map((cell, index) => (
        <div
          className="cell"
          key={'cell' + index}
          style={{ width: 100 / FIELD_SIZE + '%', paddingTop: 100 / FIELD_SIZE + '%' }}
        >
          {cell === 0 ? (
            <div
              className={`cellItem empty ${disabled && 'disabled'}`}
              onClick={() => disabled || cellClick(index)}
            ></div>
          ) : cell === 1 ? (
            <div className="cellItem player1"></div>
          ) : (
            <div className="cellItem player2"></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FieldComponent
