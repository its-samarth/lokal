import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import _ from 'lodash';


const api = 'https://fa27b89d-912b-4414-acd5-522e571d92d1.mock.pstmn.io/jobs?page=';

const HomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Debounce the setSearchQuery function with a delay of 500ms
  const debouncedSetSearchQuery = _.debounce((query) => {
    setSearchQuery(query);
  }, 500);

  const handleSearch = (text) => {
    debouncedSetSearchQuery(text);
  };

  // Compute filtered jobs based on search query
const filteredJobs = searchQuery
? jobs.filter(job => job.title?.toLowerCase().includes(searchQuery.toLowerCase()))
: jobs;


  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching data for page ${currentPage} from API...`);
      const response = await fetch(`${api}${currentPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Data fetched successfully:');
      if (currentPage === 1) {
        setJobs(result.results);
      } else {
        setJobs(prevJobs => [...prevJobs, ...result.results]);
      }
      setTotalPages(Math.ceil(result.count / result.page_size));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.boldText}>{item.title}</Text>
      {item.primary_details ? (
        <>
          <Text style={styles.normalBoldText}>Location: {item.primary_details.Place}</Text>
          <Text style={styles.normalBoldText}>Salary: {item.primary_details.Salary}</Text>
          <Text style={styles.normalBoldText}>Job Type: {item.primary_details.Job_Type}</Text>
          <Text style={styles.normalBoldText}>Experience: {item.primary_details.Experience}</Text>
          <Text style={styles.normalBoldText}>Qualification: {item.primary_details.Qualification}</Text>
        </>
      ) : (
        <Text>No additional details available</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title..."
        onChangeText={text => debouncedSetSearchQuery(text)}
      />
      <FlatList
        data={filteredJobs}
        keyExtractor={() => Math.random().toString(36).substr(2, 9)}

        renderItem={renderJobItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boldText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  normalBoldText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'normal',
    marginBottom: 5,
  },
  searchInput: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'normal',
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  pageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
