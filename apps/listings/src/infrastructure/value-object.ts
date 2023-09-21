export abstract class ValueObject<T extends ValueObject<T>> {
  protected abstract getAttributesToIncludeInEqualityCheck(): unknown[];

  equals(other: T): boolean {
    if (other == null) {
      return false;
    }
    const thisProps = this.getAttributesToIncludeInEqualityCheck();
    const otherProps = other.getAttributesToIncludeInEqualityCheck();

    if (thisProps.length !== otherProps.length) {
      return false;
    }

    for (let i = 0; i < thisProps.length; i++) {
      const thisProp = thisProps[i];
      const otherProp = otherProps[i];
      if (thisProp instanceof ValueObject) {
        if ((thisProp as ValueObject<any>).equals(otherProp) === false) {
          return false;
        }
      }
      if (thisProp !== otherProp) {
        return false;
      }
    }

    return true;
  }
}
