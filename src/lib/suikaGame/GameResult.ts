import { Fruit, setItemSizeWeight } from "./object/Fruit";
import { collection, doc, query, where, getDoc, writeBatch, orderBy, limit, getDocs, DocumentReference, DocumentData } from "firebase/firestore";
import { db, resultDoc, userDoc, scoreDoc } from "../../firebase";
import { FirebaseError } from "firebase/app";

function generateName() {
  const n1 = ['Blue', 'Berry', 'Orange', 'Tomato', 'Avocado', 'Melon', 'Apple', "Peach", "Coconut"]
  return n1[Math.round(Math.random() * (n1.length - 1))]
}

const generateRandomNumber = (min: number, max: number): string =>
    Math.floor(min + Math.random() * (max - min + 1)).toString();
    
function getRandomUserName(max=10) {
    let namePart = generateName()
    const remainingLength = max - namePart.length;

    const numberPart = remainingLength > 0 ? generateRandomNumber(Math.pow(10, remainingLength - 1), Math.pow(10, remainingLength) - 1) : '';

    return `${namePart}${numberPart}`;
}

interface BombResult {
    score: number;
    target: string;
}


export interface ScoreInfo {
    id: string;
    name: string;
    bestScore: number;
}

interface MyScoreInfo {
    rank: number;
    bestScore: number
}


export class GameResult {
    bestScore: number;
    bombCount: number | undefined;
    renewBestScore: boolean = false;
    bombCountAtStart: number;
    startAt: Date;
    endAt: Date | undefined;
    detail: Map<string, number> = new Map();
    detailBomb: Array<BombResult> = new Array();
    score: number | undefined;
    usedBombCount: number = 0;
    static userId: string;
    static userName: string = "Apple123";
    static userAgent: string = navigator.userAgent;
    static network: boolean = true;
    static rankScores: Array<ScoreInfo>;
    static scoreRef: DocumentReference<DocumentData, DocumentData>;
    static loadInfo: boolean = false;
    static itemSizeConfig: Array<number> = [0.91, 0.93, 0.95, 0.97, 0.99]
    // static itemSizeConfig: Array<number> = [5]
    static currentItemSizeConfig: number;

    constructor() {
        this.bestScore = Number(localStorage.getItem('bestScore'));
        this.bombCountAtStart = Number(localStorage.getItem('cumBombCount'));
        this.startAt = new Date();

        Object.values(Fruit).map(k => this.detail.set(k, 0));
        GameResult.applyItemSizeWeight(0);
    }

    public getMergedCount(fruit: Fruit) {
        let result = this.detail.get(fruit);
        if (result) {
            return result;
        }
        else {
            return 0;
        }
    }

    public static applyItemSizeWeight(index: number) {
        let target = index;

        if (index >= GameResult.itemSizeConfig.length) {
            target = GameResult.itemSizeConfig.length - 1;
        }

        GameResult.currentItemSizeConfig = target;
        setItemSizeWeight(GameResult.itemSizeConfig[target]);
    }

    public useBomb() {
        this.usedBombCount += 1;
    }

    public addDetail(fruit :string)
    {
        const value = this.detail.get(fruit) || 0
        this.detail.set(fruit, value + 1);

        if (fruit === Fruit.GOLDWATERMELON) {
            GameResult.applyItemSizeWeight(GameResult.currentItemSizeConfig + 1);
        }
    }

    public addDetailBomb(target :string, score: number)
    {
        this.detailBomb.push({ target: target, score: score });
    }

    public gameOver(score: number, bombCount: number) {
        this.endAt = new Date();
        this.score = score;
        this.renewBestScore = score > this.bestScore;
        this.bombCount = bombCount;

        if (this.renewBestScore) {
            gtag("event", "renewBestScore", {
                "score": score,
                "prevScore": this.bestScore,
                "userAgent": navigator.userAgent,
                "date": this.endAt,
            })
        }
    }

    public getUserRankScore()
    {
        if (this.renewBestScore) {
            return this.score;
        } else {
            return this.bestScore;
        }
    }

    public static async loadScoreRankInfo(useCache = true) {
        if (useCache && GameResult.rankScores) {
            return;
        }

        try {
            const q = query(collection(db, scoreDoc), where("bestScore", ">", 0), orderBy("bestScore", "desc"), limit(99));
            const querySnapshot = await getDocs(q);
            GameResult.rankScores = querySnapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()}
            }) as ScoreInfo[];
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log("FirestoreError: ", error.message);
                return;
            }

            throw error;
        }

        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // });
    }

    public static calculateUserRank() {
        if (!GameResult.rankScores) {
            return -1;
        }

        const userIndex = GameResult.rankScores.findIndex((score) => score.id === GameResult.scoreRef.id);
        const userRank = userIndex + 1;

        return userRank;
    }

    public static getTop3Rank() {
        if (!GameResult.rankScores) {
            return [];
        }

        return GameResult.rankScores.slice(0, 3)
    }

    public async send() {
        if (!GameResult.network) {
            return;
        }

        try {
            if (this.renewBestScore) {
                const batch = writeBatch(db);
                const resultRef = doc(collection(db, resultDoc));
                batch.set(resultRef, {
                    bestScore: this.bestScore,
                    bombCount: this.bombCount,
                    bombCountAtStart: this.bombCountAtStart,
                    startAt: this.startAt,
                    endAt: this.endAt,
                    detail:Object.fromEntries(this.detail),
                    detailBomb: this.detailBomb,
                    score: this.score,
                    usedBombCount: this.usedBombCount,
                    renewBestScore: this.renewBestScore,
                    user: doc(db, "/users/" + GameResult.userId),
                    userAgent: GameResult.userAgent,
                })

                batch.update(GameResult.scoreRef, {bestScore: this.score, result: resultRef, createdAt: this.endAt})
                await batch.commit();
            }


        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log("FirestoreError: ", error.message);
                return;
            }

            // throw error;
        }
    }

    public static async loadUserInfo() {
        try {
            let userId = localStorage.getItem('userId');
    
            if (userId)
            {
                let docSnap = await getDoc(doc(db, userDoc, userId, "info", "value"));
                if (docSnap.exists()) {
                    GameResult.userId = userId;
                    GameResult.userName = docSnap.data().name;
                    GameResult.scoreRef = docSnap.data().score;
                    return;
                }
            }
            
            let info = {model: "", platform: ""};

            if ((window.navigator as any).userAgentData) {
                info = await (window.navigator as any).userAgentData.getHighEntropyValues([  
                    "model",
                    "platform",
                ])
            }

            const batch = writeBatch(db);
            const userRef = doc(collection(db, userDoc));
            const scoreRef = doc(collection(db, scoreDoc));

            const name = getRandomUserName();
            batch.set(scoreRef, { bestScore: Number(localStorage.getItem('bestScore')), name: name, createdAt: new Date() })

            batch.set(userRef, {});
            const userInfoRef = doc(collection(userRef, "info"), "value");

            batch.set(userInfoRef, {name: name, score: scoreRef, createdAt: new Date(), model: info.model, platform: info.platform});
            
            await batch.commit()
    
            localStorage.setItem("userId", userRef.id);
            GameResult.userId = userRef.id;
            GameResult.userName = name;
            GameResult.scoreRef = scoreRef;

            GameResult.loadInfo = true;
            return;
        } catch (error) {
            GameResult.network = false;

            if (error instanceof FirebaseError) {
                console.log("FirestoreError", error.message);
                return;
            }

            // throw error;
        }
    }
}
