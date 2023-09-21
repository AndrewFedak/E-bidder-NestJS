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
      if (thisProps[i] instanceof ValueObject) {
        if (
          (thisProps[i] as ValueObject<any>).equals(otherProps[i]) === false
        ) {
          return false;
        }
      }
      if (thisProps[i] !== otherProps[i]) {
        return false;
      }
    }

    return true;
  }
}
