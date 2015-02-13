Known issues
------------

+ a repeating sequence does not call initWithTarget upon action repeat.

+ Easing functions which are ActionInOut at the same time, on reverse they reverse the target action, while 
  ActionIn and ActionOut reverse the easing function itself. This is a behavioral mutation. Should it be this way, or
  changed ? Currently, they return the easingInOut function itself.
  
  
New API motivation
------------------

+ Inconsistent Action naming: easeExponentialIn vs easeQuinticActionIn . Usa usage of 'Action' in names if inconsistent.
+ Overpopulation of cc namespace. There are 150+ action objects.
+ Reduce code complexity.
+ Offer a new more js-ish code convention via chaining of method calls.
+ Change concept of easing action. Easing is a property of an Action's time.
+ Reduce overly class-extension hierarchy in current code

+ Goal is to be backward compatible with V2 and V3 action system.