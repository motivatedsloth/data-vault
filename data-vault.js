;(function(app){

    /**
     * our data storage model
     * @param {Any} key any value that can be converted to json
     * @param {Any} name any value that can be converted to json
     */
    function model(key, value){
        if( key === null || key === undefined ){
            throw "Invalid key, must be string, object or array";
        }
        var dt = (new Date()).toString();
        return {
            key: key,
            value: value,
            created: dt,
            modified: dt
        };
    }//model

    /**
     * our storage vault, default uses localStorage, can be in memory only
     * @param {String} key name of this vault
     * @param {Boolean} memOnly true to skip localStorage
     */
    function vault(key, memOnly){
        var key = key,
        storage = !!memOnly ? localStorage : sessionStorage,
        items = load(key);

        /**
         * fetch item from localStorage or create localStorage item
         * @param {String} key to load
         */
        function load(key){
           var loaded = storage.getItem(key),
           ret = [];

           if(!loaded){
               loaded = JSON.stringify(ret);
           }

           var parsed = JSON.parse(loaded);
           for(var v in parsed){
                ret.push(new model(parsed[v]));
           }

           return ret;
        }//load

        /**
         * put items in storage
         */
        function store(){
            items.length > 0 ?
                storage.setItem(key, JSON.stringify(items)) :
                storage.removeItem(key);
        }//store

        /**
         * find the model for this key
         * @param {Any} key any JSON.stringify string, object, array value
         */
        function findModel(key){
            for(var v in items){
                if(key === items[v].key){
                    return items[v];
                }
            }
            return false;
        }//find

        /**
         * return all stored keys
         * @return {Array}
         */
        function keys(){
            ret = [];
            for(var v in items){
                ret.push(items[v].key);
            }
            return ret;
        }//key

        /**
         * store key value pair
         * @param {Any} key to store
         * @param {Any} value to store
         *
         */
        function set(key, value){
            var m = findModel(key);
            if(!m){
                m = new model(key, value);
                items.push(m);
            }else{
                m.data = value;
                m.modified = new Date();
            }
            store();
        }//set

        /**
         * get data for this key
         * @param {Any} key to get value
         */
        function get(key){
            var m = findModel(key);
            return m ? m.value : m;
        }

        /**
         * remove this key, return value for key removed
         * @param {Any} key to remove
         * @return {Any}
         */
        function remove(key){
            var m = false;
            for(var v in items){
                if(items[v].key === key){
                    m = items[v].value;
                    items.splice(v, 1);
                }
            }
            store();
            return m;
        }

        /**
         * fetch items modified since date provided
         * @param {Date} dt date to fetch newer items
         * @return {Array} array of objects {key: key, value: value}
         */
        function since(dt){
            var ret = [];
            for(var v in items){
                if(dt < new Date(items[v].created)){
                    ret.push({
                        key: items[v].key,
                        value: items[v].value
                    });
                }
            }
            return ret;
        }

        return {
            keys: keys,
            set: set,
            get: get,
            remove: remove,
            since: since
        };

    }//vault

    app.vault = vault;
}(bm));
