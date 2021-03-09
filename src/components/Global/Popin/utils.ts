import Vue from 'vue';
import { Mesure, PopupAlignement, PopupPlacement, Position, Size } from './types';

const THRESHOLD = 5;
const TRIANGLE_WIDTH = 20;
const OFFSET = 1;
export const acceptedClonedStyles: Array<keyof Partial<CSSStyleDeclaration>> = [
  'width',
  'height',
  'flex',
  'position',
  'justifyContent',
  'alignItems',
  'alignSelf',
  'alignContent',
];
type getPopupComputedOutputMesuresArgs = {
  buttonOrigin: HTMLElement;
  popupTarget: HTMLElement;
  container?: HTMLElement | Vue;
  full: boolean;
  arrow: boolean;
  offset: number;
  placement: PopupPlacement;
  alignement?: PopupAlignement;
};
export function getPopupComputedOutputMesures(args: getPopupComputedOutputMesuresArgs) {
  const elementsMesures = getElementsMesures(args);
  const { placement, maxHeight } = getPopupPlacement({
    ...elementsMesures,
    placement: args.placement,
  });
  const alignement = getPopupAlignement({
    ...elementsMesures,
    arrow: args.arrow,
    full: args.full,
    alignement: args.alignement,
  });
  const { arrowPosition, left, top, minWidth, maxWidth } = getPopupCoordinatesAndSize({
    ...elementsMesures,
    placement,
    alignement,
    full: args.full,
  });
  return {
    placement,
    alignement,
    left,
    top,
    minWidth,
    maxHeight,
    arrowPosition,
    maxWidth,
  };
}

interface ElementsMesures {
  containerMesures: Mesure;
  targetOffset: number;
  popupSize: Size;
  originMesure: Mesure;
}

/** Get calculated position and mesures */
function getElementsMesures({
  buttonOrigin,
  popupTarget,
  container,
  arrow,
  full,
  offset,
}: getPopupComputedOutputMesuresArgs): ElementsMesures {
  // Button origin mesures
  let originClientRect = buttonOrigin.getBoundingClientRect();

  let originMesure: Mesure = {
    left: originClientRect.left,
    top: originClientRect.top,
    width: originClientRect.width,
    height: originClientRect.height,
  };

  // Popup target mesures
  let popupSize: Size = {
    width: popupTarget.offsetWidth,
    height: popupTarget.offsetHeight,
  };

  const getOffset = offset ?? OFFSET;

  // Misc mesures
  const targetOffset = full || !arrow ? getOffset : 10 + getOffset;

  // Container mesures
  let containerMesures: Mesure;

  if (container) {
    const parentContainer = container instanceof HTMLElement ? container : container.$el;
    const parentContainerRect = parentContainer.getBoundingClientRect();
    containerMesures = {
      left: parentContainerRect.left,
      top: parentContainerRect.top,
      width: parentContainer.clientWidth,
      height: parentContainer.clientHeight,
    };
  } else {
    containerMesures = {
      width: window.innerWidth,
      height: window.innerHeight,
      left: 0,
      top: 0,
    };
    originMesure = {
      ...originMesure,
      left: originClientRect.left,
      top: originClientRect.top,
    };
  }

  return {
    containerMesures,
    targetOffset,
    popupSize,
    originMesure,
  };
}

function getPopupPlacement({
  originMesure,
  containerMesures,
  popupSize,
  targetOffset,
  placement: preferedPlacement,
}: ElementsMesures & { placement: PopupPlacement }): {
  placement: PopupPlacement;
  maxHeight: number;
} {
  const originBottomPosition = originMesure.height + (originMesure.top - containerMesures.top);
  // const totalHeightFromTop = originBottomPosition + popupSize.height + targetOffset;
  // const totalHeightFromBottom =
  //   containerMesures.height - originMesure.top + popupSize.height + targetOffset;
  let maxHeight: number;
  let placement: PopupPlacement;

  const spaceBottom = containerMesures.height - originBottomPosition - targetOffset - THRESHOLD;
  const spaceTop = originMesure.top - containerMesures.top - targetOffset + THRESHOLD;

  if (spaceBottom >= spaceTop) {
    placement = PopupPlacement.Bottom;
    maxHeight = spaceBottom;
  } else {
    placement = PopupPlacement.Top;
    maxHeight = spaceTop;
  }

  if (maxHeight > 450) maxHeight = 450;

  return { placement, maxHeight };
}

function getPopupAlignement({
  originMesure,
  containerMesures,
  popupSize,
  targetOffset,
  arrow,
  alignement,
  full,
}: ElementsMesures & {
  arrow: boolean;
  full: boolean;
  alignement?: PopupAlignement;
}): PopupAlignement {
  let processedAlignement!: PopupAlignement;
  const popupCenteredPosition = originMesure.left + originMesure.width / 2 - popupSize.width / 2;

  if (full) {
    processedAlignement = PopupAlignement.Full;
  } else if (alignement) {
    processedAlignement = alignement;
  } else if (popupSize.width > containerMesures.width) {
    processedAlignement = PopupAlignement.ContainerFull;
  } else if (
    popupCenteredPosition > containerMesures.left + THRESHOLD &&
    popupCenteredPosition + popupSize.width + THRESHOLD <
      containerMesures.left + containerMesures.width
  ) {
    processedAlignement = PopupAlignement.Center;
  } else if (
    originMesure.left + popupSize.width <
    containerMesures.left + containerMesures.width + THRESHOLD
  ) {
    processedAlignement = PopupAlignement.Start;
  } else if (
    originMesure.left + originMesure.width - popupSize.width >
    containerMesures.left + THRESHOLD
  ) {
    processedAlignement = PopupAlignement.End;
  } else if (
    containerMesures.left + THRESHOLD + popupSize.width <
    containerMesures.left + containerMesures.width
  ) {
    processedAlignement = PopupAlignement.ContainerEnd;
  } else if (
    containerMesures.left + containerMesures.width - popupSize.width + THRESHOLD <
    containerMesures.left
  ) {
    processedAlignement = PopupAlignement.ContainerStart;
  } else {
    processedAlignement = PopupAlignement.ContainerFull;
  }
  return processedAlignement;
}

interface getPopupCoordinatesAndSize {
  placement: PopupPlacement;
  alignement: PopupAlignement;
  containerMesures: Mesure;
  targetOffset: number;
  popupSize: Size;
  originMesure: Mesure;
  full: boolean;
}
function getPopupCoordinatesAndSize({
  originMesure,
  containerMesures,
  popupSize,
  targetOffset,
  placement,
  alignement,
  full,
}: getPopupCoordinatesAndSize): {
  left: string;
  top: string;
  minWidth: number;
  arrowPosition: string;
  maxWidth: number;
} {
  let popupFinalWidth = full ? originMesure.width : popupSize.width;
  let maxWidth = containerMesures.width - THRESHOLD * 2;

  let outputLeft: number;
  let outputTop: number;

  if (full || alignement === PopupAlignement.Full) {
    outputLeft = originMesure.left;
  } else if (alignement === PopupAlignement.ContainerFull) {
    outputLeft = containerMesures.left + THRESHOLD;
    popupFinalWidth = containerMesures.width - THRESHOLD * 2;
  } else if (alignement === PopupAlignement.End) {
    outputLeft = originMesure.left + originMesure.width - popupFinalWidth;
  } else if (alignement === PopupAlignement.ContainerEnd) {
    outputLeft = containerMesures.left + containerMesures.width - popupFinalWidth - THRESHOLD;
  } else if (alignement === PopupAlignement.Start) {
    outputLeft = originMesure.left;
  } else if (alignement === PopupAlignement.ContainerStart) {
    outputLeft = containerMesures.left + THRESHOLD;
  } else {
    outputLeft = originMesure.left - popupFinalWidth / 2 + originMesure.width / 2;
  }
  if (placement === PopupPlacement.Top) {
    outputTop = originMesure.top - targetOffset - popupSize.height;
  } else {
    outputTop = originMesure.top + originMesure.height + targetOffset;
  }

  let arrowPosition =
    originMesure.left - outputLeft + originMesure.width / 2 - TRIANGLE_WIDTH / 2 + 'px';

  return {
    left: outputLeft + 'px',
    top: outputTop + 'px',
    minWidth: popupFinalWidth,
    arrowPosition,
    maxWidth,
  };
}

export function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  if (node == null) return null;
  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentElement);
  }
}
