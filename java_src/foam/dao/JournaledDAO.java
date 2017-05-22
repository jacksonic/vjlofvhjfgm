package foam.dao;

import foam.core.Detachable;
import foam.core.FObject;
import foam.core.Journal;

import foam.mlang.order.Comparator;
import foam.mlang.predicate.Predicate;

import java.io.FileDescriptor;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Created by carlos on 2017-05-22.
 */
public class JournaledDAO extends ProxyDAO {

    private FileJournal journal;

    public JournaledDAO(DAO delegate, FileJournal journal) {
        this.journal = journal;
        this.setDelegate(delegate);
    }

    public void setJournal(FileJournal journal) {
        this.journal = journal;
    }

    /**
     *
     * persists data into FileJournal then calls the delegated DAO.
     *
     * @param obj
     * @returns FObject
     */
    @Override
    public FObject put(FObject obj) {
        this.journal.put(obj, null);
        return this.getDelegate().put(obj);
    }

    @Override
    public FObject remove(FObject obj) {
        this.journal.remove(obj, null);
        return this.getDelegate().remove(obj);
    }

    @Override
    public FObject find(Object id) {
        return null;
    }

    @Override
    public Sink select(Sink sink, Integer skip, Integer limit, Comparator order, Predicate predicate) {
        return null;
    }

    @Override
    public void removeAll(Integer skip, Integer limit, Comparator order, Predicate predicate) {

    }
}
