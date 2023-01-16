import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getNweets();
    dbService
      .collection("nweets")
      .orderBy("createdAt", "desc")
      /*.orderBy("desc")가 없으면 정렬이 안됨. 순서가 뒤죽박죽 */
      .onSnapshot((snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
