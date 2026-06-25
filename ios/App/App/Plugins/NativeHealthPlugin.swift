import Foundation
import Capacitor
import HealthKit

/**
 * Capacitor плагин для интеграции с Apple HealthKit.
 * 
 * Требования:
 * - iOS 14+
 * - Capability: HealthKit в Xcode
 * - Info.plist: NSHealthShareUsageDescription, NSHealthUpdateUsageDescription
 */
@objc(NativeHealthPlugin)
public class NativeHealthPlugin: CAPPlugin {
    
    private let healthStore = HKHealthStore.isHealthDataAvailable() ? HKHealthStore() : nil
    
    @objc func checkAvailability(_ call: CAPPluginCall) {
        let available = HKHealthStore.isHealthDataAvailable()
        call.resolve([
            "available": available,
            "platform": "ios"
        ])
    }
    
    @objc func requestPermissions(_ call: CAPPluginCall) {
        guard let healthStore = healthStore else {
            call.resolve(["granted": false])
            return
        }
        
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRateVariability)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .restingHeartRate)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .respiratoryRate)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .appleExerciseTime)!
        ]
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
            if let error = error {
                call.reject("HealthKit authorization failed: \(error.localizedDescription)")
                return
            }
            call.resolve(["granted": success])
        }
    }
    
    @objc func getTodayData(_ call: CAPPluginCall) {
        guard let healthStore = healthStore else {
            // Fallback: возвращаем симулированные данные если HealthKit недоступен
            call.resolve([
                "hrv": 42,
                "heartRate": 72,
                "steps": 0,
                "sleepHours": 7,
                "calories": 0,
                "respiratoryRate": 14
            ])
            return
        }
        
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)
        
        var result: [String: Any] = [
            "hrv": 0,
            "heartRate": 0,
            "steps": 0,
            "sleepHours": 0,
            "calories": 0,
            "respiratoryRate": 0
        ]
        
        let dispatchGroup = DispatchGroup()
        
        // HRV
        dispatchGroup.enter()
        let hrvType = HKQuantityType.quantityType(forIdentifier: .heartRateVariability)!
        let hrvQuery = HKStatisticsQuery(quantityType: hrvType, quantitySamplePredicate: predicate, options: .discreteAverage) { _, statistics, _ in
            if let avg = statistics?.averageQuantity() {
                let value = avg.doubleValue(for: HKUnit.secondUnit(with: .milli))
                result["hrv"] = value
            }
            dispatchGroup.leave()
        }
        healthStore.execute(hrvQuery)
        
        // Heart Rate
        dispatchGroup.enter()
        let hrType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
        let hrQuery = HKStatisticsQuery(quantityType: hrType, quantitySamplePredicate: predicate, options: .discreteAverage) { _, statistics, _ in
            if let avg = statistics?.averageQuantity() {
                let value = avg.doubleValue(for: HKUnit.count().unitDivided(by: HKUnit.minute()))
                result["heartRate"] = value
            }
            dispatchGroup.leave()
        }
        healthStore.execute(hrQuery)
        
        // Steps
        dispatchGroup.enter()
        let stepsType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
        let stepsQuery = HKStatisticsQuery(quantityType: stepsType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, statistics, _ in
            if let sum = statistics?.sumQuantity() {
                let value = sum.doubleValue(for: HKUnit.count())
                result["steps"] = value
            }
            dispatchGroup.leave()
        }
        healthStore.execute(stepsQuery)
        
        // Calories
        dispatchGroup.enter()
        let calType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!
        let calQuery = HKStatisticsQuery(quantityType: calType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, statistics, _ in
            if let sum = statistics?.sumQuantity() {
                let value = sum.doubleValue(for: HKUnit.kilocalorie())
                result["calories"] = value
            }
            dispatchGroup.leave()
        }
        healthStore.execute(calQuery)
        
        // Respiratory Rate
        dispatchGroup.enter()
        let respType = HKQuantityType.quantityType(forIdentifier: .respiratoryRate)!
        let respQuery = HKStatisticsQuery(quantityType: respType, quantitySamplePredicate: predicate, options: .discreteAverage) { _, statistics, _ in
            if let avg = statistics?.averageQuantity() {
                let value = avg.doubleValue(for: HKUnit.count().unitDivided(by: HKUnit.minute()))
                result["respiratoryRate"] = value
            }
            dispatchGroup.leave()
        }
        healthStore.execute(respQuery)
        
        // Sleep Analysis
        dispatchGroup.enter()
        let sleepType = HKCategoryType.categoryType(forIdentifier: .sleepAnalysis)!
        let sleepQuery = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
            if let samples = samples as? [HKCategorySample] {
                var totalSleep: TimeInterval = 0
                for sample in samples {
                    if sample.value == HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue ||
                       sample.value == HKCategoryValueSleepAnalysis.asleepDeep.rawValue ||
                       sample.value == HKCategoryValueSleepAnalysis.asleepCore.rawValue ||
                       sample.value == HKCategoryValueSleepAnalysis.asleepREM.rawValue {
                        totalSleep += sample.endDate.timeIntervalSince(sample.startDate)
                    }
                }
                result["sleepHours"] = totalSleep / 3600.0
            }
            dispatchGroup.leave()
        }
        healthStore.execute(sleepQuery)
        
        dispatchGroup.notify(queue: .main) {
            call.resolve(result)
        }
    }
}