import Ember from 'ember'

const {isNone} = Ember

export default function getTransformedX (x, xTransform, yAxisTicksAboveLines, yTickLabelWidth, yAxisPadding) {
  if (isNone(x) || isNone(xTransform)) {
    return
  }

  const transformedX = xTransform(x)

  return yAxisTicksAboveLines ? transformedX + yTickLabelWidth + yAxisPadding : transformedX
}
