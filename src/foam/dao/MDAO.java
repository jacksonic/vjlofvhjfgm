/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */
package foam.dao;

import foam.core.AbstractFObject;
import foam.core.ClassInfo;
import foam.core.FObject;
import foam.core.PropertyInfo;
import foam.core.X;
import foam.dao.index.*;
import foam.mlang.order.Comparator;
import foam.mlang.predicate.Or;
import foam.mlang.predicate.Predicate;

import java.util.ArrayList;
import java.util.List;

public class MDAO extends AbstractDAO {

  protected AltIndex index_;
  protected Object state_;

  public MDAO(ClassInfo of) {
    setOf(of);
    state_ = null;
    index_ = new AltIndex(new TreeIndex((PropertyInfo) this.of_.getAxiomByName("id")));
  }

  public void addIndex(PropertyInfo prop) {
    index_.addIndex(new TreeIndex(prop));
  }

  public void addIndex(Index index) { index_.addIndex(index);}

  public FObject put_(X x, FObject obj) {
    FObject oldValue = find(obj);
    if ( oldValue != null ) {
      state_ = index_.remove(state_, oldValue);
    }
    state_ = index_.put(state_, obj);
    return obj;
  }

  public FObject remove_(X x, FObject obj) {
    if ( obj == null ) {
      return null;
    }
    FObject found = find(obj);
    if ( found != null ) {
      state_ = index_.remove(state_, obj);
    }
    return obj;
  }

  public FObject find_(X x, Object o) {
    if ( o == null ) {
      return null;
    }
    return AbstractFObject.maybeClone(
        getOf().isInstance(o)
            ? (FObject)index_.planFind(state_,getPrimaryKey().get(o)).find(state_,getPrimaryKey().get(o))
            : (FObject)index_.planFind(state_, o).find(state_,o)
    );
  }

  public Sink select_(X x, Sink sink, long skip, long limit, Comparator order, Predicate predicate) {
    SelectPlan plan;
    if ( predicate instanceof Or ) {
      int length = ( (Or) predicate ).getArgs().length;
      List<Plan> planList = new ArrayList<>();
      for ( int i = 0; i < length; i++ ) {
        Predicate arg = ( (Or) predicate ).getArgs()[i];
        planList.add(index_.planSelect(state_, sink, skip, limit, order, arg));
      }
      plan = new OrPlan(predicate, planList);
    } else {
      plan = index_.planSelect(state_, sink, skip, limit, order, predicate);
    }
    plan.select(state_, sink, skip, limit, order, predicate);
    sink.eof();
    return sink;
  }

  public void removeAll_(X x, long skip, long limit, Comparator order, Predicate predicate) {
    state_ = null;
  }

}
