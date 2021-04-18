/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.core;

import java.util.HashSet;
import java.util.Set;
import java.util.function.Supplier;

public class SubX extends ProxyX {
  /**
   * Lazy root context accessor
   */
  protected Supplier<X> root_;

  /**
   * Parent path
   */
  protected String parent_;

  /**
   * Keys of all services added to the subX.
   *
   * Storing {@code serviceKeys} allows preventing {@code get(key)} call from
   * propagating to the parent context when overriding a service as null.
   */
  protected Set serviceKeys_;

  /**
   * Key of {@code serviceKeys} to put in the subX
   */
  public static final String SERVICE_KEYS = "_SubX_";

  public SubX(Supplier<X> root, String parent) {
    this(root, parent, new ProxyX());
  }

  public SubX(Supplier<X> root, String parent, X delegate) {
    root_ = root;
    parent_ = parent;

    serviceKeys_ = (Set) delegate.get(SERVICE_KEYS);
    if ( serviceKeys_ == null ) serviceKeys_ = new HashSet();

    setX(delegate.put(SERVICE_KEYS, serviceKeys_));
  }

  private X getParent() {
    var root = root_.get();
    return parent_.isBlank() ? root : root.cd(parent_);
  }

  @Override
  public Object get(X x, Object key) {
    var ret = getX().get(x, key);
    return ret != null || serviceKeys_.contains(key) ? ret
      : getParent().get(x, key);
  }

  @Override
  public X put(Object key, Object value) {
    serviceKeys_.add(key);
    if ( getX() instanceof ProxyX ) {
      getX().put(key, value);
      return this;
    }

    var delegate = new ProxyX(getX()).put(SERVICE_KEYS, new HashSet(serviceKeys_));
    return new SubX(root_, parent_, delegate).put(key, value);
  }

  @Override
  public X putFactory(Object key, XFactory factory) {
    serviceKeys_.add(key);
    if ( getX() instanceof ProxyX ) {
      getX().putFactory(key, factory);
      return this;
    }

    var delegate = new ProxyX(getX()).put(SERVICE_KEYS, new HashSet(serviceKeys_));
    return new SubX(root_, parent_, delegate).putFactory(key, factory);
  }

  @Override
  public int getInt(Object key, int defaultValue) {
    Number i = (Number) getX().get(key);
    if ( i == null && ! serviceKeys_.contains(key) ) {
      i = (Number) getParent().get(key);
    }
    return i == null ? defaultValue : i.intValue();
  }

  @Override
  public boolean getBoolean(Object key, boolean defaultValue) {
    Boolean b = (Boolean) getX().get(key);
    if ( b == null && ! serviceKeys_.contains(key) ) {
      b = (Boolean) getParent().get(key);
    }
    return b == null ? defaultValue : b;
  }

  @Override
  public Object getInstanceOf(Object value, Class type) {
    var ret = ((FacetManager) get("facetManager")).getInstanceOf(value, type, getX());
    return ret != null ? ret : ((FacetManager) get("facetManager")).getInstanceOf(value, type, getParent());
  }

  @Override
  public <T> T create(Class<T> type, java.util.Map<String, Object> args) {
    var ret = ((FacetManager)get("facetManager")).create(type, args, getX());
    return ret != null ? ret : ((FacetManager)get("facetManager")).create(type, args, getParent());
  }

  @Override
  public X cd(String path) {
    return cd(getX(), path);
  }

  public void freeze() {
    if ( getX() instanceof ProxyX ) {
      setX(((ProxyX) getX()).getX());
    }
  }
}
