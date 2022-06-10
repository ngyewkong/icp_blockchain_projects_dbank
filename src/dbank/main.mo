// import debug module to print debug
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

// actor class
actor DBank {
  // without stable keyword flexible variable (normal programming style)
  // stable keyword turns it into a stable variable
  // meaning state get persisted even on redeploy
  stable var currentValue: Float = 300;
  // currentValue := 100;

  // now gives current time in nanoseconds since 01-01-1970
  // stable var as we want start time to hold its state 
  stable var startTime = Time.now();

  public query func checkTime(): async Int {
    return startTime;
  };

  Debug.print(debug_show(startTime));

  // let sets constant (immutable)
  let id = 123432123412312312;

  //Debug.print("Hello World!");
  //Debug.print(debug_show(id));
  //Debug.print(debug_show(currentValue));


  // let users deposit crypto
  // example of private function
  // only accessible within the actor DBank
  // adding public keyword expose the function to the public
  // allow the canister to be called from outside the DBank actor class
  public func topUp(amt: Float) {
    currentValue += amt;
    Debug.print(debug_show(currentValue));
  };

  // function to do withdrawal
  // input param amt
  public func withdraw(amt: Float) {
    // Int can be tve or -ve
    let tempValue: Float = currentValue - amt;
    if (tempValue >= 0) {
      currentValue -= amt;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Withdrawal amount is greater than account value");
    };
    
  };

  public query func checkBalance(): async Float {
    // read only operation
    // hence can use query keyword to speed things up
    return currentValue;
  };

  // function to calculate compound interest
  public func compound() {
    let currentTime = Time.now();
    let timeElapsedNS = currentTime - startTime;
    let timeElapsedS = timeElapsedNS / 1000000000;
    let timeElapsedM = timeElapsedS / 60;

    // type mismatch 
    // handle mismatch by using float lib
    // convert time elapsed from whole to decimal

    currentValue := currentValue * (1.01 ** Float.fromInt(timeElapsedM));

    // reset the start time
    startTime := currentTime;

  }
}