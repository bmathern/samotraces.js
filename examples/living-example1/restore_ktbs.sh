#! /bin/bash

# This is a shell script to recreate a ktbs base and ktbs
# trace for the purpose of this example.
# 
# This script is used when the ktbs crashes and corrupts
# the database and that a new database has been created.

curl http://127.0.0.1/ktbs/

curl -H "Content-Type:text/turtle;" -d "#
@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
<> :hasBase <base-OFS-TestProto1/>.
<base-OFS-TestProto1/>
    a :Base ;
    rdfs:label \"Test OFS\" ." http://127.0.0.1/ktbs/


curl -H "Content-Type:text/turtle;" -d "#
@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#> .
<> :contains <trace-test1/> .
<trace-test1/>
    a :StoredTrace ;
    :hasModel <http://liris.cnrs.fr/silex/2011/simple-trace-model/> ;
    :hasOrigin \"1970-01-01T00:00:00Z\" ;
    :hasDefaultSubject \"me\" ." http://127.0.0.1/ktbs/base-OFS-TestProto1/

