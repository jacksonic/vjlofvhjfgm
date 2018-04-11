package foam.dao;

import foam.core.*;
import foam.util.ConcurrentList;
import foam.util.List;
import foam.mlang.order.Comparator;
import foam.mlang.predicate.Predicate;

public class FixedSizeDAO
  extends AbstractDAO
{
  private List<FObject> list;
  public FixedSizeDAO(X x, ClassInfo classInfo, int maxSize) {
    setX(x);
    setOf(classInfo);
    list = new ConcurrentList<FObject>(maxSize, true);
  }

  public FObject put_(X x, FObject obj) {
    Object key = getPrimaryKey().get(obj);
    if ( key == null ) {
      throw new RuntimeException("Missing Primary Key in " + this.getOf().getId() + ".put()");
    }
    list.enQueue(obj);
    onPut(obj.fclone());
    return obj;
  }

  public FObject remove_(X x, FObject obj) {
    FObject ret = null;
    FObject[] fo = new FObject[list.size()];
    fo = list.toArray(fo);
    int i = 0;
    for ( ; i < fo.length ; i ++ ) {
      if ( getPrimaryKey().get(fo[i]).equals(getPrimaryKey().get(obj)) ) break;
    }
    ret = list.remove(fo[i], i);
    return ret;
  }

  public FObject find_(X x, Object o) {
    FObject ret = null;
    FObject[] fo = new FObject[list.size()];
    fo = list.toArray(fo);
    for ( int i = 0 ; i < fo.length ; i ++ ) {
      Object id = getPrimaryKey().get(fo[i]);
      if ( getOf().isInstance(o) ? id.equals(getPrimaryKey().get(o)) : id.equals(o) ) {
        ret = fo[i];
        break;
      }
    }
    return AbstractFObject.maybeClone(ret);
  }

  public Sink select_(X x, Sink sink, long skip, long limit, Comparator order, Predicate predicate) {
    sink = prepareSink(sink);
    Sink         decorated = decorateSink_(sink, skip, limit, order, predicate);
    Subscription sub       = new Subscription();
    FObject[] fo = new FObject[list.size()];
    fo = list.toArray(fo);
    for ( int i = 0 ; i < fo.length ; i++ ) {
      if ( sub.getDetached() ) break;
      decorated.put(fo[i], sub);
    }
    decorated.eof();
    return sink;
  }
}